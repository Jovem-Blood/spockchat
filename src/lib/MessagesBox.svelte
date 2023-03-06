<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";
  import Messages from "./Messages.svelte";
  import Typing from "./Typing.svelte";

  let newMessage = "";
  let messages = [];
  let userMessages = [];
  let unsubscribe: () => void;
  let typing = false;
  let typingUser: any;
  let typingTimmer: any;
  let len = 0;

  let getUserId = (m: any) => {
    return m?.expand?.user_id?.id;
  };
  function startTyping() {
    if (typing == false) {
      typing = true;
      pb.collection("users").update($currentUser.id, { typing });
    }

    clearTimeout(typingTimmer);
    stopTyping();
  }

  function stopTyping(timer = 5000) {
    len = newMessage.length;
    typingTimmer = setTimeout(() => {
      if (newMessage.length == len && typing == true) {
        typing = false;
        pb.collection("users").update($currentUser.id, { typing });
      } else {
      }
    }, timer);
  }

  $: if (newMessage.length > 0) {
    startTyping();
  }

  async function sendMessage() {
    const data = {
      content: newMessage,
      user_id: $currentUser.id,
    };
    const createdMessage = await pb.collection("messages").create(data);

    if (!createdMessage) {
      console.log("Error while sending message, please try again");
    }
    newMessage = "";
    stopTyping(0);
  }

  onMount(async () => {
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "-created",
      expand: "user_id",
    });

    messages = resultList.items.reverse();

    let pivo = [];
    messages.forEach((m, i) => {
      if (getUserId(m) == getUserId(messages[i - 1])) {
        pivo.push(m);
      } else {
        userMessages.push([...pivo]);
        pivo = [];
        pivo.push(m);
      }
    });
    userMessages.push([...pivo]);
    userMessages.shift();
    userMessages = userMessages;

    unsubscribe = await pb
      .collection("messages")
      .subscribe("*", async ({ action, record }) => {
        if (action == "create") {
          const user_id = await pb.collection("users").getOne(record.user_id);
          record.expand = { user_id };
          messages = [...messages, record];

          if (getUserId(record) == getUserId(userMessages.slice(-1)[0][0])) {
            userMessages.slice(-1)[0].push(record);
          } else {
            userMessages.push([record]);
          }
          userMessages = userMessages;
        }

        if (action == "delete") {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
    pb.collection("users").subscribe("*", async ({ action, record }) => {
      if (action !== "update" || record.id == $currentUser.id) return;

      if (record.typing !== false) {
        typingUser = record;
      } else {
        typingUser = "";
      }
    });
  });
  onDestroy(() => {
    unsubscribe?.();
  });
  function handdleKeyDown(key: KeyboardEvent) {
    if (key.code == "Enter" && !key.shiftKey) {
      sendMessage();
    }
  }
</script>

<div class="messages-box">
  <Messages messages={userMessages} />
  <div class="bottom-form">
    {#if typingUser}
      <Typing username={typingUser.username} />
    {:else}
      <div style="visibility: hidden;">
        <Typing username="nobody" />
      </div>
    {/if}
    <textarea
      class="input-message"
      placeholder="Message..."
      bind:value={newMessage}
      on:keydown={handdleKeyDown}
    />
  </div>
</div>

<style>
  .messages-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: auto;
    max-height: 100vh;
  }
  .input-message {
    resize: none;
    border-radius: 10px;
    border: none;
    box-shadow: 1px 0px 6px 2px #371da0;
    outline-width: 0;
    width: 100%;
  }
  .bottom-form {
    width: 99%;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
</style>

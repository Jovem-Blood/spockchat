<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";
  import Messages from "./Messages.svelte";
  import Typing from "./Typing.svelte";

  let newMessage = "";
  let messages = [];
  let unsubscribe: () => void;
  let typing = false;
  let typingUser: any;
  let len = 0;

  function startTyping() {
    if (typing == false) {
      typing = true;
      pb.collection("users").update($currentUser.id, { typing });
      console.log("startTyping...");
    }

    stopTyping();
  }

  function stopTyping(timer = 5000) {
    len = newMessage.length;
    setTimeout(() => {
      if (newMessage.length == len && typing == true) {
        typing = false;
        console.log("stoTyping...");

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

    unsubscribe = await pb
      .collection("messages")
      .subscribe("*", async ({ action, record }) => {
        if (action == "create") {
          const user_id = await pb.collection("users").getOne(record.user_id);
          record.expand = { user_id };
          messages = [...messages, record];
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
    // console.log(await messages[0])
  });
  onDestroy(() => {
    unsubscribe?.();
  });
  function handdleKeyDown(key) {
    // if(key.code == "Enter") {
    if (key.code == "Enter" && !key.shiftKey) {
      sendMessage();
    }
  }
</script>

<div class="messages-box">
  <Messages {messages} />
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

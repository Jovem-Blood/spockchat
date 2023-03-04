<script lang="ts">
  import { onMount, onDestroy, afterUpdate, beforeUpdate} from "svelte";
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

  function stopTyping(timer=5000) {
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
    stopTyping(0)
  }

  onMount(async () => {
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      expand: "user_id",
    });
    messages = resultList.items;

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
</script>


<Messages {messages} />

<form on:submit|preventDefault={sendMessage}>
  <div class="bottom-form">
    {#if typingUser}
      <Typing username={typingUser.username} />
    {:else}
      <div style="visibility: hidden;">
        <Typing username="nobody" />
      </div>
    {/if}
    <input
      class="input-message"
      placeholder="Message..."
      type="text"
      bind:value={newMessage}
    />
  </div>
</form>

<style>
  .input-message {
    width: 100%;
    padding: 2%;
    border-radius: 10px;
    border: none;
    box-shadow: 1px 0px 6px 2px #371da0;
    outline-width: 0;
  }
  .bottom-form {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  form {
    position: fixed;
    bottom: 0;
    width: 50%;
  }
</style>

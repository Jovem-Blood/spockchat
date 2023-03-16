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
  let img: string | Blob;
  let imgPreview: string | ArrayBuffer;

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
    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("user_id", $currentUser.id);

    if (img) formData.append("archive", img);

    const createdMessage = await pb.collection("messages").create(formData);

    if (!createdMessage) {
      console.log("Error while sending message, please try again");
    }
    newMessage = "";
    img = null;
    imgPreview = null;
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
  function handleKeyDown(key: KeyboardEvent) {
    if (key.code == "Enter" && !key.shiftKey) {
      key.preventDefault();
      sendMessage();
    }
  }
  function handlePaste(pasteEvent: ClipboardEvent) {
    let item = pasteEvent.clipboardData.items[0];
    if (item.type.indexOf("image") === 0) {
      img = item.getAsFile();

      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = function (event) {
        imgPreview = event.target.result;
      };
    }
  }
</script>

<div class="messages-box">
  <Messages messages={userMessages} />
  {#if imgPreview}
    <img src={imgPreview.toString()} alt="sus" width="120px" />
  {/if}
  <div class="bottom-form">
    {#if typingUser}
      <Typing username={typingUser.username} />
    {:else}
      <div style="visibility: hidden;">
        <Typing username="nobody" />
      </div>
    {/if}
    <div class="input-group">
      <textarea
        class="input-message"
        placeholder="Message..."
        bind:value={newMessage}
        on:paste={handlePaste}
        on:keydown={handleKeyDown}
      />
      <button class="send-message" on:click={sendMessage}>-></button>
    </div>
  </div>
</div>

<style>
  .send-message {
    display: none;
  }
  .input-group {
    display: flex;
    width: 100%;
  }
  @media (max-width: 600px) {
    .send-message {
      display: block;
      width: 15%;
    }
  }
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

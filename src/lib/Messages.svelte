<script lang="ts">
  import { afterUpdate, beforeUpdate } from "svelte";
  import { pb } from "./pocketbase";
  import { marked } from "marked";

  export let messages: any[];
  let autoscroll: boolean;
  let div: any;

  const renderer = {
    heading() {
      return ``;
    },
    html() {
      return ``;
    },
    code() {
      return ``;
    },
  };

  marked.use({ renderer });
  beforeUpdate(() => {
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) div.scrollTo(0, div.scrollHeight);
  });
</script>

<div bind:this={div} class="messages">
  <div class="message-area">
    {#each messages as message (message[0]?.id)}
      <div class="message-item">
        <div class="avatar-wrapper">
          <img
            src={`https://api.dicebear.com/5.x/identicon/svg?seed=${message[0]?.expand?.user_id?.username}`}
            alt="user avatar"
          />
        </div>

        <div class="message">
          <span>
            {message[0]?.expand?.user_id?.username}
          </span>

          {#each message as text}
            <span class="message-text"> {@html marked(text.content)} </span>
            {#if text.archive}
              <img src={pb.getFileUrl(text, text.archive)} alt="file pic" />
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .message-item {
    display: flex;
    margin-bottom: 2rem;
  }
  .messages {
    text-align: initial;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    justify-content: start;
  }
  .avatar-wrapper {
    border-radius: 50px;
    background: azure;
    width: fit-content;
    height: fit-content;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar-wrapper img {
    width: 32px;
  }

  .message {
    display: flex;
    align-items: start;
    margin-left: 1rem;
    flex-direction: column;
  }
</style>

<script lang="ts">
  import { afterUpdate, beforeUpdate } from "svelte";
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

<!-- <svelte:window bind:scrollY={scroll} /> -->

<div bind:this={div} class="messages ">
  {#each messages as message (message.id)}
    <div class="message-area">
      <div class="avatar-wrapper">
        <img
          class="avatar"
          src={`https://api.dicebear.com/5.x/identicon/svg?seed=${message.expand?.user_id?.username}`}
          width="30px"
          alt="user avatar"
        />
      </div>
      <span class="message">
        {message.expand?.user_id?.username}:&nbsp; {@html marked(
          message.content
        )}
      </span>
      <!-- <p class="msg-text">{message.content}</p> -->
    </div>
  {/each}
</div>

<style>
  .messages {
    margin-bottom: 10%;
  }
  .avatar-wrapper {
    border-radius: 50px;
    background: azure;
    width: fit-content;
    height: fit-content;
    padding: 7%;
    display: flex;
    justify-content: center;
    align-items: center;

    align-self: center;
    justify-self: end;
    margin-right: 1rem;
    grid-column: 1;
  }

  .message-area {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-bottom: 2%;
  }
  .message {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    justify-self: start;
    grid-column: 2/5;
  }
</style>

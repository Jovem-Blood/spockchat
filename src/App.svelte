<script lang="ts">
  import { currentUser, pb } from "./lib/pocketbase";
  import Login from "./lib/Login.svelte";
  import MessagesBox from "./lib/MessagesBox.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    console.log(0, document.body.scrollHeight)
  })
  function logOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentUser}
  <!-- <button on:click={logOut}>Log Out</button> -->
  <MessagesBox />
{:else}
  <Login/>
{/if}



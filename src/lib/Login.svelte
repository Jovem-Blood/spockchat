<script lang="ts">
  import { pb } from "./pocketbase";

  let username: string;
  let password: string;
  let action = "login";

  async function logIn() {
    pb.collection("users")
      .authWithPassword(username, password)
      .then(() => dispatchEvent);
  }

  async function signUp() {
    const data = {
      username,
      password,
      passwordConfirm: password,
      name: "",
    };
    pb.collection("users")
      .create(data)
      .then((_c) => {
        logIn();
      })
      .catch((error) => {
        console.log(`Got an error: ${error}`);
      });
  }
  function changeAction() {
    action = action == "login" ? "signup" : "login";
  }
  function handleSubmit() {
    if (action == "login") {
      logIn();
    } else {
      signUp();
    }
  }
</script>

<div class="myDiv">
  <h3 style="text-transform: capitalize;">{action}</h3>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="input-area">
      <label for="username">Nome de usuário:</label>
      <input placeholder="username" type="text" bind:value={username} />
    </div>

    <div class="input-area">
      <label for="password">Senha:</label>
      <input placeholder="password" type="password" bind:value={password} />
    </div>

    {#if action == "login"}
      <button type="submit">Logar</button>
      <a href={action} on:click|preventDefault={changeAction}>Não tenho conta</a>
    {:else if action == "signup"}
      <button type="submit">Criar conta</button>
      <a href={action} on:click|preventDefault={changeAction}>Já tenho conta</a>
    {/if}
  </form>
</div>

<style>
  .myDiv {
    display: flex;
    flex-direction: column;
    background: white;
    color: gray;
    border-radius: 15px;
    margin: auto;
    padding: 5%;
  }
  .input-area {
    display: flex;
    align-items: start;
    flex-direction: column;
    margin: 2%;
  }
</style>

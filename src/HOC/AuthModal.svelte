<script>
  import Card from "../components/Card.svelte";
  import Button from "../components/Button.svelte";
  import Input from "../components/Input.svelte";
  import Loader from "../components/Loader.svelte";
  import { authStore } from "../store/auth";

  let login;
  let password;
  let loading = false;

  const onSubmit = async () => {
    try {
      loading = true;
      await authStore.login(login, password);
    } finally {
      loading = false;
    }
  };
</script>

<div class="wrapper">
  <Card>
    <h2>Авторизация</h2>
    <form on:submit|preventDefault={onSubmit}>
      <Input bind:value={login} label="Логин" placeholder="Введите логин" />
      <Input
        bind:value={password}
        label="Пароль"
        placeholder="Введите пароль"
        type="password"
      />
      <div class="footer">
        {#if loading}
          <div class="loading">
            <Loader message="Авторизация.." />
          </div>
        {/if}
        <Button disabled={loading || !(login && password)} type="submit"
          >Войти</Button
        >
      </div>
    </form>
  </Card>
</div>

<style>
  .wrapper {
    max-width: 340px;
    width: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  .loading {
    flex-grow: 1;
    padding-right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>

<script lang="ts">
  import Card from "../components/Card.svelte";
  import Button from "../components/Button.svelte";
  import Input from "../components/Input.svelte";
  import Loader from "../components/Loader.svelte";
  import { authStore } from "../store/auth";

  const form = {
    login: "",
    password: "",
  };
  let loading = false;
  let error = "";

  const onChangeForm = (field: keyof typeof form) => (value: CustomEvent) => {
    error = "";
    form[field] = value.detail;
  };

  const onSubmit = async () => {
    try {
      loading = true;
      await authStore.login(form.login, form.password);
      window.location.reload();
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.error) {
        error = data.error_description;
      }
    } finally {
      loading = false;
    }
  };
</script>

<div class="wrapper">
  <Card>
    <h2>Авторизация</h2>
    <form on:submit|preventDefault={onSubmit}>
      <Input
        value={form.login}
        on:input={onChangeForm("login")}
        label="Логин"
        placeholder="Введите логин"
      />
      <Input
        value={form.password}
        on:input={onChangeForm("password")}
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
        {#if error}
          <span class="error_message">{error}</span>
        {/if}
        <Button
          disabled={Boolean(error || loading || !(form.login && form.password))}
          type="submit">Войти</Button
        >
      </div>
    </form>
  </Card>
</div>

<style>
  .wrapper {
    width: 340px;
  }

  h2 {
    margin-bottom: 4px;
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
    align-items: center;
  }
  .loading {
    flex-grow: 1;
    padding-right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .error_message {
    flex-grow: 1;
    color: var(--base-red);
  }
</style>

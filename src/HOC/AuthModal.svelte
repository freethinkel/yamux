<script lang="ts">
  import Card from '../components/Card.svelte';
  import Button from '../components/Button.svelte';
  import Input from '../components/Input.svelte';
  import Loader from '../components/Loader.svelte';
  import { authStore } from '../store/auth';

  let loading = false;
  let error = '';

  const onSubmit = async () => {
    try {
      loading = true;
      await authStore.login();
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
    <div class="body">
      <Button on:click={() => onSubmit()}>Войти</Button>
    </div>
  </Card>
</div>

<style>
  .wrapper {
    width: 340px;
  }

  h2 {
    margin-bottom: 4px;
  }
  .body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
  }
  .body :global(button) {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
</style>

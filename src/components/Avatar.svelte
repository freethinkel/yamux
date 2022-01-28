<script lang="ts">
  export let name: string | undefined;
  export let url: string | undefined = undefined;
  export let size = 32;

  const initials = (name || "")
    .split(/\s/)
    .map((e) => e[0])
    .join("");
</script>

<div class="wrapper" style={`--size: ${size}px;`}>
  {#if url}
    <img src={url} alt={name} />
  {:else}
    <span class="initials">{initials}</span>
  {/if}
</div>

<style>
  .wrapper {
    border-radius: var(--avatar-radius, 50%);
    border: 1px solid var(--base-border);
    background-color: var(--base-panel);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size, 32px);
    height: var(--size, 32px);
    overflow: hidden;
  }
  .initials {
    color: var(--base-primary);
    font-size: calc(var(--size) / 2);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>

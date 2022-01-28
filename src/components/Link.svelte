<script lang="ts">
  export let url: string | undefined;
</script>

<a href={url}>
  <slot />
</a>

<style>
  a {
    color: var(--base-primary);
    text-decoration: none;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    gap: 2px;
    outline: none;
    border-radius: var(--border-radius);
    padding: 2px 6px;
    overflow: hidden;
  }
  a:hover::after {
    height: 100%;
  }
  a::after {
    content: "";
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 2px;
    left: 0;
    right: 0;
    transition: var(--transition);
    background-color: var(--base-primary12);
  }
</style>

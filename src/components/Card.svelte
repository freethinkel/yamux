<div class="card">
  <slot />
</div>

<style>
  .card {
    padding: var(--card-padding, 12px);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-black12);
    background-color: var(--color-white);
  }
</style>

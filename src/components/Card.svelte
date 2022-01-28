<div class="card">
  <slot />
</div>

<style>
  .card {
    padding: var(--card-padding, 12px);
    border-radius: var(--border-radius);
    background-color: var(--card-color, var(--color-white));
  }
</style>

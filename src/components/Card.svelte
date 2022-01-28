<div class="card">
  <slot />
</div>

<style>
  .card {
    padding: var(--card-padding, 12px);
    border-radius: var(--border-radius);
    background-color: var(--base-panel);
  }
</style>

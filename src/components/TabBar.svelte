<script lang="ts" context="module">
	type TabItem = {
		title: string;
	};
</script>

<script lang="ts">
	export let tabs: TabItem[] = [];
	export let active = 0;

	let activeTabEl: HTMLDivElement;
	let tabsWrapperEl: HTMLDivElement;

	const changeTab = (index: number) => {
		active = index;
	};

	$: {
		if (activeTabEl && tabsWrapperEl) {
			const currentEl = tabsWrapperEl.querySelectorAll('button')[active] as HTMLElement;
			activeTabEl.style.width = `${currentEl.offsetWidth}px`;
			activeTabEl.style.left = `${currentEl.offsetLeft}px`;
		}
	}
</script>

<div class="wrapper">
	<div class="tabs__header" bind:this={tabsWrapperEl}>
		<div class="active-tab__line" bind:this={activeTabEl} />
		{#each tabs as tab, index}
			<button class="tab" on:click={() => changeTab(index)}>
				{tab.title}
			</button>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
	}
	.tabs__header {
		display: flex;
		gap: 16px;
		position: relative;
		border-bottom: 1px solid var(--color-black12);
		width: 100%;
	}
	.active-tab__line {
		content: '';
		position: absolute;
		transition: var(--transition);
		bottom: -1px;
		height: 3px;
		background-color: var(--color-primary);
		border-radius: 4px 4px 0 0;
	}
	.tab {
		outline: none;
		padding: 8px 2px;
		font-size: 0.8rem;
		font-weight: bold;
		cursor: pointer;
		border: none;
		background: none;
		transition: var(--transition);
		border-radius: var(--border-radius);
		appearance: none;
		color: var(--color-black);
	}
	.tab:hover {
		opacity: 0.6;
	}
	.tab:active {
		transform: scale(0.98);
	}
</style>

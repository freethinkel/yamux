<script lang="ts">
	import { getTime } from './EventsTimeList.svelte';

	export let title: string = '';
	export let description: string | undefined = '';
	export let color: string | undefined = '';
	export let timeEnd: Date;
	export let timeStart: Date;
</script>

<div class="wrapper" style={`--color: ${color};`}>
	<div class="title">{title}</div>
	<div class="description">{description}</div>

	<div class="time">
		<div class="time_start">{getTime(timeStart)}</div>
		-
		<div class="time_end">{getTime(timeEnd)}</div>
	</div>
</div>

<style>
	.wrapper {
		border-radius: var(--border-radius);
		position: relative;
		overflow: hidden;
		background-color: var(--color-white);
		padding: 4px 8px;
		box-shadow: 0 3px 6px var(--color-black12);
		width: 100%;
		border-left: 4px solid var(--color, --color-primary);
		height: 100%;
		min-height: 70px;
	}
	.title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 1.1rem;
		font-weight: bold;
	}
	.description {
		font-size: 0.9rem;
		color: var(--color-black80);
		margin-top: 2px;
	}
	.time {
		display: flex;
		align-items: center;
		font-size: 0.8rem;
		font-weight: 200;
		text-transform: uppercase;
		margin-top: 4px;
	}
</style>

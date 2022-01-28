<script lang="ts">
	export let message: string | undefined = undefined;
	export let progress: number | undefined = undefined;

	$: isProgress = progress !== undefined;
</script>

<div class="wrapper">
	<div class="spinner" class:animate={!isProgress}>
		<svg viewBox="0 0 50 50">
			<circle
				stroke-width="5"
				stroke-dasharray={`${(progress / 100) * 125}, 150`}
				cx="25"
				cy="25"
				r="20"
			/>
		</svg>
	</div>
	{#if message}
		<span class="message">{message}</span>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.spinner {
		width: 28px;
		height: 28px;
		transform: rotate(-90deg);
	}
	.spinner.animate {
		animation: spinner 2s linear infinite;
	}
	.spinner.animate svg circle {
		animation: dash 1.5s ease-in-out infinite;
	}
	.spinner :global(.ti) {
		font-size: 28px;
		color: var(--spinner-color, var(--color-primary));
	}
	.message {
		font-weight: bold;
		color: var(--message-color, var(--color-black));
	}
	svg {
		height: 28px;
		width: 28px;
	}
	svg circle {
		fill: none;
		stroke: var(--spinner-color, var(--color-primary));
		stroke-linecap: round;
	}

	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}
</style>

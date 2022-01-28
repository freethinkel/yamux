<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let type: 'text' | 'password' | 'checkbox' | 'radio' | 'file' | 'button' | 'number' =
		'text';
	export let as: 'input' | 'textarea' = 'input';
	export let label: string = '';
	export let placeholder: string = '';
	export let value: string = '';
	export let naked: boolean = false;
	export let regExp: RegExp | undefined = undefined;

	let textarea;

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (as === 'textarea') {
			onResize(textarea);
		}
	});

	const onResize = (el) => {
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	};

	const onChange = (event) => {
		const _value = event.target.value;
		if (regExp && !regExp.test(_value) && _value.trim() !== '') {
			event.target.value = value;
			value = value;
			return;
		}
		if (as === 'textarea') {
			onResize(event.target);
		}
		dispatch('input', _value);
		value = _value;
	};
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class:naked>
	{#if label}
		<span class="label">{label}</span>
	{/if}
	{#if as === 'textarea'}
		<textarea
			id="__input"
			{type}
			{placeholder}
			{value}
			bind:this={textarea}
			on:input={onChange}
			on:change={onChange}
		/>
	{/if}
	{#if as === 'input'}
		<input {type} {placeholder} {value} on:input={onChange} on:change={onChange} />
	{/if}
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input,
	textarea {
		outline: none;
		border: none;
		padding: 0;
		margin: 0;
		background: transparent;
		width: 100%;
		resize: none;
		appearance: none;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	label textarea {
		min-height: 60px;
		max-height: 1000px;
		overflow: hidden;
		padding-bottom: 8px;
		font-family: inherit;
	}

	label:not(.naked) input,
	textarea {
		border: 1px solid var(--color-primary12);
		padding: 4px 8px;
		border-radius: var(--border-radius);
		background: var(--color-white);
		font-size: 1.1rem;
	}
	.label {
		font-size: 0.8rem;
		font-weight: bold;
		padding: 0 4px;
	}
</style>

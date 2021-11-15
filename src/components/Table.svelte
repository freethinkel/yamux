<script context="module" lang="ts">
	export type TableHead = {
		text: string;
	};
	export type TableCol = {
		text: string;
	};
	export type TableRow = {
		columns: TableCol[];
		id: string | number;
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let hoverable: boolean = false;
	export let headers: TableHead[] = [];
	export let data: TableRow[] = [];

	const dispatch = createEventDispatcher();
	const onSelectRow = (data: TableRow) => dispatch('selectRow', data);
</script>

<div class="wrapper">
	<table>
		<thead>
			{#each headers as head}
				<th>
					<div class="head">
						<span class="head__text">{head.text}</span>
					</div>
				</th>
			{/each}
		</thead>
		<tbody>
			{#each data as row}
				<tr class:hoverable on:click={() => onSelectRow(row)}>
					{#each row.columns as col}
						<td>
							<div class="col">
								<span class="col__text">{col.text}</span>
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.wrapper {
		background-color: var(--color-white);
		border-radius: var(--border-radius);
		box-shadow: 0 2px 3px var(--color-black12);
		overflow-x: auto;
	}
	table {
		border-collapse: collapse;
		border-radius: var(--border-radius);
		width: 100%;
	}

	th {
		text-align: left;
		padding: 4px 12px;
		height: 32px;
		background: var(--color-black12);
	}
	th:last-child {
		border-top-right-radius: var(--border-radius);
	}
	th:first-child {
		border-top-left-radius: var(--border-radius);
	}

	thead {
		width: 100%;
	}
	tr {
		border-top: 1px solid var(--color-black12);
	}
	td {
		padding: 4px 12px;
		height: 32px;
	}
	.hoverable {
		transition: var(--transition);
		cursor: pointer;
	}
	.hoverable:hover {
		background-color: var(--color-black06);
	}
</style>

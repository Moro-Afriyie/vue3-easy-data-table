<template>
	<div class="easy-data-table__rows-selector">
		<div class="rows-input__wrapper" @click="showList = !showList">
			<div class="rows-input">
				{{ rowsComputed }}
			</div>
			<!-- <div class="triangle"></div> -->
			<div class="page-size">
				<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
					<path
						d="M4.5 10.1667L8.66667 14.3333L12.8333 10.1667M4.5 5.16667L8.66667 1L12.8333 5.16667"
						stroke="#079455"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
		<ul class="select-items" :class="{ show: showList, inside: showInsideOfTable }">
			<li
				v-for="item in rowsItems"
				:key="item"
				:class="{ selected: item === rowsComputed }"
				@click="changeSelectedRows(item)"
			>
				{{ item }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType, onMounted, onBeforeUnmount, inject, watch, Ref } from 'vue';

const props = defineProps({
	modelValue: { type: Number, required: true },
	rowsItems: { type: Array as PropType<number[]>, required: true },
});

const emits = defineEmits(['update:modelValue']);

const showList = ref(false);

const showInsideOfTable = ref(false);
const dataTable = inject('dataTable') as Ref<HTMLDivElement>;
watch(showList, (val) => {
	if (val && dataTable) {
		const windowHeight = window.innerHeight;
		const dataTableHeight = dataTable.value.getBoundingClientRect().height;
		const dataTableTop = dataTable.value.getBoundingClientRect().top;
		if (windowHeight - (dataTableHeight + dataTableTop) <= 100) {
			showInsideOfTable.value = true;
		} else {
			showInsideOfTable.value = false;
		}
	}
});

const rowsComputed = computed({
	get: (): number => props.modelValue,
	set: (value: number): void => {
		emits('update:modelValue', value);
	},
});

const changeSelectedRows = (value: number) => {
	rowsComputed.value = value;
	showList.value = false;
};

// Click outside to close rows selector
// @ts-ignore
const isDescendant = (child, className) => {
	let node = child.parentNode;
	while (node != null) {
		if (node.classList && node.classList.contains(className)) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
};

// @ts-ignore
const closeRowsSelector = (e) => {
	if (!isDescendant(e.target, 'easy-data-table__rows-selector')) showList.value = false;
};

onMounted(() => {
	document.addEventListener('click', closeRowsSelector);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', closeRowsSelector);
});

const themeColor = inject('themeColor');
</script>

<style scoped lang="scss">
.easy-data-table__rows-selector {
	display: inline-block;
	min-width: 45px;
	position: relative;
	margin: 0px 10px;
	width: var(--easy-table-rows-per-page-selector-width);
	.page-size {
	}
	.rows-input__wrapper {
		height: 20px;
		border-bottom: 1px solid var(--easy-table-footer-font-color);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 5px;
		display: flex;
		height: 40px;
		padding: 8px 12px;
		align-items: center;
		gap: 8px;
		border-radius: 12px;
		border: 1px solid #d5d7da;
		background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.05) inset, 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
		min-width: 71px;
		box-sizing: border-box;
		cursor: pointer;
		.triangle {
			display: inline-block;
			vertical-align: middle;
			width: 0px;
			height: 0px;
			border-top: solid 6px var(--easy-table-footer-font-color);
			border-left: solid 6px transparent;
			border-right: solid 6px transparent;
		}
	}
	ul.select-items {
		&.show {
			display: block;
		}
		&.inside {
			bottom: 0px;
			top: auto;
		}
		position: absolute;
		top: 20px;
		left: 0px;
		width: 100%;
		display: none;
		margin: 0px;
		padding: 0px;
		text-align: left;
		list-style-type: none;
		box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);
		z-index: var(--easy-table-rows-per-page-selector-z-index);
		li {
			cursor: pointer;
			padding: var(--easy-table-rows-per-page-selector-option-padding);
			background-color: var(--easy-table-footer-background-color);

			&.selected {
				color: #fff;
				background-color: v-bind(themeColor);
			}
		}
	}
}
</style>

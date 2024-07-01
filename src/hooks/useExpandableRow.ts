import { ref, Ref, ComputedRef } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName } from '../types/internal';

export default function useExpandableRow(
	items: Ref<Item[]>,
	prevPageEndIndex: ComputedRef<number>,
	emits: (event: EmitsEventName, ...args: any[]) => void,
	fullPageMetrics: Ref<Item>
) {
	const expandingItemIndexList = ref<number[]>([]);

	const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Item, event: Event) => {
		expandingItemIndexList.value = [];
		event.stopPropagation();
		const index = expandingItemIndexList.value.indexOf(expandingItemIndex);
		if (index !== -1) {
			expandingItemIndexList.value.splice(index, 1);
		} else {
			let currentPageExpandIndex = items.value.findIndex(
				(item) => JSON.stringify(item) === JSON.stringify(expandingItem)
			);

			const isFullPageMetrics = JSON.stringify(fullPageMetrics.value) === JSON.stringify(expandingItem);

			if (isFullPageMetrics) {
				currentPageExpandIndex = expandingItemIndex;
			}
			expandingItemIndexList.value.push(prevPageEndIndex.value + currentPageExpandIndex);
		}
	};

	const clearExpandingItemIndexList = () => {
		expandingItemIndexList.value = [];
	};

	return {
		expandingItemIndexList,
		updateExpandingItemIndexList,
		clearExpandingItemIndexList,
	};
}

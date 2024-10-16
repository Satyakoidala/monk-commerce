import { useEffect, useReducer } from "react";
import handlers from "./handlers";

const ACTIONS = {
	INIT: "init",
	CREATE_NEW_PRODUCT: "create_new_product",
	REMOVE_PRODUCT_OR_VARIANT: "remove_product_or_variant",
	UPDATE_DISCOUNT: "update_discount",
	OPEN_DISCOUNT_MENU: "open_discount_menu",
	UPDATE_PRODUCT_ITEM: "update_product",
	ON_DRAG_START: "start_drag",
	ON_DRAG_END: "end_drag",
	ON_DRAG_DROP: "drop_dragged",
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case ACTIONS.INIT:
			return {
				productList: [],
				currDraggingItem: null,
				activeProductId: null,
				currVariantDraggingItem: null,
			};
		case ACTIONS.CREATE_NEW_PRODUCT:
			return handlers.addEmptyProduct(state, payload);
		case ACTIONS.UPDATE_PRODUCT_ITEM:
			return handlers.handleProductUpdate(state, payload);
		case ACTIONS.UPDATE_DISCOUNT:
			return handlers.updateDiscount(state, payload);
		case ACTIONS.REMOVE_PRODUCT_OR_VARIANT:
			return handlers.removeProduct(state, payload);
		case ACTIONS.OPEN_DISCOUNT_MENU:
			return handlers.onDiscountButtonClick(state, payload);
		case ACTIONS.ON_DRAG_START:
			return handlers.handleDragStart(state, payload);
		case ACTIONS.ON_DRAG_END:
			return handlers.handleDragEnd(state, payload);
		case ACTIONS.ON_DRAG_DROP:
			return handlers.handleDrop(state, payload);
		default:
			return state;
	}
};

const useProductList = () => {
	const [state, dispatch] = useReducer(reducer, {});

	useEffect(() => {
		dispatch({
			type: ACTIONS.INIT,
		});
	}, []);

	const createEmptyProduct = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.CREATE_NEW_PRODUCT,
		});
	};

	const updateProductItem = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.UPDATE_PRODUCT_ITEM,
		});
	};

	const updateDiscount = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.UPDATE_DISCOUNT,
		});
	};

	const removeProduct = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.REMOVE_PRODUCT_OR_VARIANT,
		});
	};

	const onDiscountOptionClick = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.OPEN_DISCOUNT_MENU,
		});
	};

	const handleDragStart = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.ON_DRAG_START,
		});
	};

	const handleDragEnd = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.ON_DRAG_END,
		});
	};

	const handleDrop = (payload) => {
		dispatch({
			payload,
			type: ACTIONS.ON_DRAG_DROP,
		});
	};

	return {
		state,
		createEmptyProduct,
		updateProductItem,
		updateDiscount,
		removeProduct,
		onDiscountOptionClick,
		handleDragStart,
		handleDragEnd,
		handleDrop,
	};
};

export default useProductList;

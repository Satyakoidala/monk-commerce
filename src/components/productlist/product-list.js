import React, { Fragment, useState } from "react";
import _ from "lodash";
import cn from "classnames";
import createSeparateHandlers from "../utils";
import { Button, EditInput } from "../form-elements";
import DiscountField from "../discount-field/discount-field";
import ProductPicker from "../productpicker/product-picker";
import useProductList from "./useProductList";

import properties from "../../assets/properties.json";
import cross from "../../assets/images/cross.png";
import "./product-list.scss";

const AddProductButton = ({ onClick = _.noop }) => {
	return (
		<Button onClick={onClick} classnames={["add-product-button"]}>
			{_.get(properties, "addProduct")}
		</Button>
	);
};

const ProductItemTemplate = ({
	classnames = [],
	id,
	item,
	fullData,
	productId,
	children,
	showVariantsLink = false,
	handleClickForShowVariantsLink = _.noop,
	round = false,
	showRemove,
	onRemove = _.noop,
	onDiscountOptionClick = _.noop,
	updateDiscount = _.noop,
	updateProductItem = _.noop,
}) => {
	const [showProductPicker, toggleShowProductPicker] = useState(false);
	const [mainClass = ""] = classnames;
	return (
		<>
			<div className={cn(mainClass, "list-row", "row")}>
				<div
					className={cn("column large-1", "number", {
						after: !id,
					})}
				>
					{id && `${id}.`}
				</div>
				<div
					className={cn(
						"column",
						{
							"large-7": id,
							"large-6": !id,
						},
						"name"
					)}
				>
					<EditInput
						value={item.title}
						placeholderTitle={_.get(properties, "selectProduct")}
						handleClick={() => {
							toggleShowProductPicker(!showProductPicker);
						}}
						round={round}
					/>
					{showProductPicker && (
						<ProductPicker
							item={fullData}
							showOverlay={showProductPicker}
							onClose={() => {
								toggleShowProductPicker(!showProductPicker);
							}}
							onProductAddition={updateProductItem}
						/>
					)}
				</div>
				<div className="column large-4 actions">
					<DiscountField
						id={`discount_${item.productId || item.id}`}
						showOptions={item.showDiscountOptions}
						round={round}
						item={item}
						productId={productId}
						onButtonClick={onDiscountOptionClick}
						onValueChange={updateDiscount}
					/>
					{showRemove && (
						<Button
							onClick={() => {
								if (item.productId === productId) {
									onRemove({ itemId: productId });
								} else {
									onRemove({
										itemId: productId,
										variantId: item.id,
									});
								}
							}}
							classnames={["remove-product-button"]}
						>
							<img alt="cross" src={cross} />
						</Button>
					)}
				</div>
			</div>
			{showVariantsLink && (
				<div className="show-variants-link row">
					<div
						className="column"
						{...createSeparateHandlers(
							handleClickForShowVariantsLink
						)}
					>
						<span className="text">
							{children
								? _.get(properties, "hideVariants")
								: _.get(properties, "showVariants")}
						</span>
						<span
							className={cn({
								open: children,
								close: !children,
							})}
						>
							&gt;
						</span>
					</div>
				</div>
			)}
			{children}
		</>
	);
};

const ProductListItem = ({
	item,
	index,
	showRemove,
	handleDragStart,
	handleDragEnd,
	handleDragOver,
	handleDrop,
	...rest
}) => {
	const [showVariants, toggleShowVariants] = useState(false);
	const { variants: variantList = [] } = item;

	return (
		<div
			className="product-list-item"
			onDragStart={(e) =>
				handleDragStart({ productId: item.productId, event: e })
			}
			onDragEnd={handleDragEnd}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={() => {
				handleDrop({ productId: item.productId });
			}}
			draggable={!showVariants}
		>
			<ProductItemTemplate
				id={index + 1}
				classnames={["product-list-row"]}
				item={item}
				fullData={item}
				productId={item.productId}
				handleClickForShowVariantsLink={() => {
					toggleShowVariants(!showVariants);
				}}
				showVariantsLink={variantList.length > 0}
				showRemove={showRemove}
				{...rest}
			>
				{showVariants &&
					variantList.map((variant) => {
						return (
							<div
								key={variant.id}
								onDragStart={(e) =>
									handleDragStart({
										productId: item.productId,
										variantId: variant.id,
										event: e,
									})
								}
								onDragEnd={() =>
									handleDragEnd({ variantId: variant.id })
								}
								onDragOver={(e) => {
									e.preventDefault();
								}}
								onDrop={() => {
									handleDrop({
										productId: item.productId,
										variantId: variant.id,
									});
								}}
								draggable
							>
								<ProductItemTemplate
									productId={item.productId}
									classnames={["variant-list-row"]}
									item={variant}
									fullData={item}
									showRemove={variantList.length !== 1}
									round
									{...rest}
								/>
							</div>
						);
					})}
			</ProductItemTemplate>
		</div>
	);
};

const ProductList = () => {
	const {
		state = {},
		createEmptyProduct,
		updateProductItem,
		removeProduct,
		onDiscountOptionClick,
		updateDiscount,
		handleDragStart,
		handleDragEnd,
		handleDragOver,
		handleDrop,
	} = useProductList();

	const list = _.get(state, "productList", []);

	return (
		<div className="product-list-wrapper">
		{ list.length >0 &&	<><h1 className="product-list-header">
				{_.get(properties, "addProducts")}
			</h1>
			<div className="product-list">
				<div className="header row">
					<div className="column large-1"></div>
					<div className="column large-7">
						<span className="title">
							{_.get(properties, "product")}
						</span>
					</div>
					<div className="column large-4">
						<span className="title">
							{_.get(properties, "discount")}
						</span>
					</div>
				</div>
				<div className="body">
					{list.map((item, index) => {
						return (
							<Fragment key={index}>
								<ProductListItem
									{...{
										item,
										index,
										showRemove: list.length !== 1,
										onRemove: removeProduct,
										onDiscountOptionClick,
										updateDiscount,
										updateProductItem,
										handleDragStart,
										handleDragEnd,
										handleDragOver,
										handleDrop,
									}}
								/>
							</Fragment>
						);
					})}
				</div>
			</div></> }
			<div className="actions row">
				<AddProductButton onClick={createEmptyProduct} />
			</div>
		</div>
	);
};

export default ProductList;

import React, { Fragment, useEffect } from "react";
import _ from "lodash";
import useProductPicker from "./useProductPicker";
import OverlayLoader, { Spinner } from "../overlay/index";
import { Button, MultiCheckBox, SearchTextInput } from "../form-elements";

import properties from "../../assets/properties.json";
import "./product-picker.scss";

const LabelMain = ({ src, title }) => {
	return (
		<>
			<picture>
				<source srcSet={src} />
				{/* fallback image */}
				<img
					width="36"
					height="36"
					src="https://img.icons8.com/isometric/36/box.png"
					alt={title}
				/>
			</picture>
			<span>{title}</span>
		</>
	);
};

const LabelVariant = ({ variant = {} }) => {
	return (
		<span className="variant-item-label-content row">
			<span className="label-title">{variant.title}</span>
			<span className="label-price">${variant.price}</span>
		</span>
	);
};

const ProductPicker = ({
	item,
	showOverlay = false,
	onClose = _.noop,
	onProductAddition = _.noop,
	...rest
}) => {
	const {
		searchText,
		setSearchText,
		isDataFetching,
		setIsDataFetching,
		data,
		setData,
		displayCount,
		setDisplayCount,
		selection,
		fetchSearchData,
		onSelectMain,
		onSelectVariant,
		handleScroll,
	} = useProductPicker(item);

	useEffect(() => {
		const controller = new AbortController();
		// eslint-disable-next-line
		const signal = controller.signal;

		setData([]);
		setIsDataFetching(true);

		const fetchTimeout = setTimeout(() => {
			fetchSearchData(searchText, signal).then((res) => {
				setIsDataFetching(false);
				if (!_.isNull(res)) setData(res);
				else setData([]);

				setDisplayCount(10);
			});
		}, 500);

		return () => {
			clearTimeout(fetchTimeout);
			controller.abort();
		};
	}, [searchText]);

	return (
		<OverlayLoader
			show={showOverlay}
			classnames={["product-picker"]}
			onClose={onClose}
			addFallback
			{...rest}
		>
			<div className="title row">
				{_.get(properties, "selectProducts")}
			</div>
			<div className="search-bar row">
				<SearchTextInput
					handleClick={(ev) => {
						setSearchText(ev.target.value);
					}}
				/>
			</div>
			{isDataFetching && <Spinner />}
			{!isDataFetching && (
				<div className="product-menu row" onScroll={handleScroll}>
					{data?.length > 0 ? (
						data.slice(0, displayCount).map((product) => {
							return (
								<Fragment key={product.id}>
									<MultiCheckBox
										data={product}
										prefillData={item}
										shouldPrefillData={
											item.id === product.id
										}
										onSelectMain={onSelectMain}
										onSelectVariant={onSelectVariant}
										MainLabel={LabelMain}
										VariantLabel={LabelVariant}
									/>
								</Fragment>
							);
						})
					) : (
						<div className="search-result-text">
							{_.get(properties, "searchResultEmpty")}
						</div>
					)}
				</div>
			)}
			<div className="actions row">
				<div className="column large-7">
					{selection.length === 1
						? `${selection.length} ${_.get(
								properties,
								"productSelected"
						  )}`
						: `${selection.length} ${_.get(
								properties,
								"productsSelected"
						  )}`}
				</div>
				<div className="column options large-5">
					<Button classnames={["cancel-btn"]} handleClick={onClose}>
						{_.get(properties, "cancel")}
					</Button>
					<Button
						classnames={["add-products-btn", "button-green"]}
						handleClick={() => {
							onProductAddition({
								selection,
								productId: item.productId,
							});
							onClose();
						}}
					>
						{_.get(properties, "add")}
					</Button>
				</div>
			</div>
		</OverlayLoader>
	);
};

export default ProductPicker;

import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, object, func, string } from 'prop-types';
import { Input, Button, Radio, Divider, Collapse, Tooltip } from 'antd';
import { UndoOutlined, BgColorsOutlined } from '@ant-design/icons';
import initialTheme, {
	nestedColors as nestedStructure,
} from 'config/colors/light';
import systemThemes from 'config/colors';
import {
	getColorByKey,
	filterTheme,
	CALCULATED_COLOR_KEYS,
	CALCULATED_COLOR_RATIO_OBJECT,
	calculateBaseColors,
} from 'utils/color';
import validateColor from 'validate-color';
import ColorInput from './ColorInput';

const { Group } = Radio;

class AddTheme extends Component {
	constructor(props) {
		super(props);
		const { themes, selectedTheme: themeKey = '' } = this.props;
		const isEditTheme = !!themeKey;
		const theme =
			themeKey && themes[themeKey] ? themes[themeKey] : initialTheme;
		const filteredTheme = filterTheme(theme);
		const baseRatios = CALCULATED_COLOR_RATIO_OBJECT;

		this.state = {
			isEditTheme,
			themeKey,
			theme: filteredTheme,
			isSingleBase: false,
			isDarken: true,
			baseRatios,
		};
	}

	addTheme = () => {
		const { themeKey, theme, isSingleBase, baseRatios, isDarken } = this.state;
		const { onSave } = this.props;

		if (isSingleBase) {
			const calculatedColors = calculateBaseColors(
				theme['base_background'],
				isDarken,
				baseRatios
			);

			this.setState(
				(prevState) => ({
					...prevState,
					theme: {
						...prevState.theme,
						...calculatedColors,
					},
				}),
				() => {
					const { theme, themeKey } = this.state;
					onSave(themeKey, theme);
				}
			);
		} else {
			onSave(themeKey, theme);
		}
	};

	updateTheme = (value, name) => {
		this.setState((prevState) => ({
			...prevState,
			theme: {
				...prevState.theme,
				[name]: value,
			},
		}));
	};

	updateRatio = (value, name) => {
		this.setState((prevState) => ({
			...prevState,
			baseRatios: {
				...prevState.baseRatios,
				[name]: value,
			},
		}));
	};

	handleInputChange = ({ target: { value, name } }) => {
		if (this.isCalculated(name)) {
			this.updateRatio(value, name);
		} else {
			this.updateTheme(value, name);
		}
	};

	handleThemeKey = ({ target: { value: themeKey } }) => {
		this.setState({
			themeKey,
		});
	};

	isSaveDisabled = () => {
		const { isEditTheme, themeKey } = this.state;
		const { themes } = this.props;
		const themeKeys = Object.keys(themes);

		return !themeKey || (!isEditTheme && themeKeys.includes(themeKey));
	};

	onReset = (name) => {
		const value = getColorByKey(name);
		this.updateTheme(value, name);
	};

	handleBaseMode = ({ target: { value } }) => {
		this.setState({
			isSingleBase: value,
		});
	};

	isCalculated = (key) => {
		const { isSingleBase } = this.state;
		if (!isSingleBase) {
			return false;
		} else {
			return CALCULATED_COLOR_KEYS.includes(key);
		}
	};

	handleColorMode = ({ target: { value } }) => {
		this.setState({
			isDarken: value,
		});
	};

	validateRatio = (value) => {
		return value >= 0 && value <= 1;
	};

	validateColor = ({ target: { value, name } }) => {
		if (!this.isCalculated(name) && !validateColor(value)) {
			this.onReset(name);
		} else if (this.isCalculated(name) && !this.validateRatio(value)) {
			this.updateRatio(0, name);
		}
	};

	pickerHandler = (value, name) => {
		this.updateTheme(value, name);
		this.validateColor({ target: { value, name } });
	};

	resetTheme = () => {
		const { themeKey } = this.state;
		const defaultTheme = systemThemes[themeKey];
		this.setState((prevState) => ({
			...prevState,
			theme: defaultTheme,
		}));
	};

	isSystemDefined = () => {
		const { themeKey } = this.state;
		return Object.keys(systemThemes).includes(themeKey);
	};

	render() {
		const { isOpen, onCloseDialog } = this.props;
		const {
			isEditTheme,
			themeKey,
			theme,
			isSingleBase,
			baseRatios,
			isDarken,
		} = this.state;

		return (
			<Modal
				isOpen={isOpen}
				label="operator-controls-modal"
				className="operator-controls__modal"
				disableTheme={true}
				onCloseDialog={() => onCloseDialog(true)}
				shouldCloseOnOverlayClick={true}
				showCloseText={true}
				bodyOpenClassName="operator-controls__modal-open"
			>
				<div className="operator-controls__all-strings-header">
					<div className="operator-controls__modal-title">
						{`${isEditTheme ? 'Edit' : 'Add'} theme`}
					</div>
				</div>
				<div className="my-4 d-flex align-center">
					<div className="bold mr-4">Theme:</div>
					<Input
						disabled={isEditTheme}
						type="text"
						name="theme-key"
						placeholder="Please enter a theme name"
						className="operator-controls__input mr-2"
						value={themeKey}
						onChange={this.handleThemeKey}
					/>
					<Button
						ghost
						shape="circle"
						size="small"
						className="operator-controls__all-strings-settings-button"
						disabled={!this.isSystemDefined()}
						onClick={this.resetTheme}
						icon={<UndoOutlined />}
					/>
				</div>
				<div className="mb-5">
					<Group onChange={this.handleBaseMode} value={isSingleBase}>
						<Radio value={false}>
							<Tooltip
								overlayStyle={{ zIndex: 10001 }}
								title="Separated base theme definition"
							>
								Use separated base
							</Tooltip>
						</Radio>
						<Radio value={true}>
							<Tooltip
								overlayStyle={{ zIndex: 10001 }}
								title="single base theme definition"
							>
								Use single base
							</Tooltip>
						</Radio>
					</Group>
					{isSingleBase && (
						<div className="pl-5">
							<Group onChange={this.handleColorMode} value={isDarken}>
								<Radio value={true}>Darken</Radio>
								<Radio value={false}>Lighten</Radio>
							</Group>
						</div>
					)}
				</div>
				<div>
					{Object.entries(nestedStructure).map(([clusterKey, clusterObj]) => {
						const renderCollapse = clusterKey === 'base' && isSingleBase;

						return (
							<div className="pb-4" key={clusterKey}>
								<Divider orientation="left">
									<span className="caps">
										<BgColorsOutlined /> {clusterKey}
									</span>
								</Divider>
								{renderCollapse ? (
									<Collapse defaultActiveKey={['1']} bordered={false} ghost>
										<Collapse.Panel showArrow={false} key="1" disabled={true}>
											{Object.keys(clusterObj)
												.filter(
													(localColorKey) => localColorKey === 'background'
												)
												.map((localColorKey) => {
													const colorKey = `${clusterKey}_${localColorKey}`;
													const isCalculated = this.isCalculated(colorKey);
													const colorValue = isCalculated
														? baseRatios[colorKey]
														: theme[colorKey];

													return (
														<ColorInput
															colorKey={colorKey}
															isCalculated={isCalculated}
															colorValue={colorValue}
															pickerHandler={this.pickerHandler}
															onReset={this.onReset}
															validateColor={this.validateColor}
															onChange={this.handleInputChange}
														/>
													);
												})}
										</Collapse.Panel>
										<Collapse.Panel
											showArrow={false}
											header="Modify theme breakdown"
											key="2"
										>
											{Object.keys(clusterObj)
												.filter(
													(localColorKey) => localColorKey !== 'background'
												)
												.map((localColorKey) => {
													const colorKey = `${clusterKey}_${localColorKey}`;
													const isCalculated = this.isCalculated(colorKey);
													const colorValue = isCalculated
														? baseRatios[colorKey]
														: theme[colorKey];

													return (
														<ColorInput
															colorKey={colorKey}
															isCalculated={isCalculated}
															colorValue={colorValue}
															pickerHandler={this.pickerHandler}
															onReset={this.onReset}
															validateColor={this.validateColor}
															onChange={this.handleInputChange}
														/>
													);
												})}
										</Collapse.Panel>
									</Collapse>
								) : (
									<div className="pt-2">
										{Object.keys(clusterObj).map((localColorKey) => {
											const colorKey = `${clusterKey}_${localColorKey}`;
											const isCalculated = this.isCalculated(colorKey);
											const colorValue = isCalculated
												? baseRatios[colorKey]
												: theme[colorKey];

											return (
												<ColorInput
													colorKey={colorKey}
													isCalculated={isCalculated}
													colorValue={colorValue}
													pickerHandler={this.pickerHandler}
													onReset={this.onReset}
													validateColor={this.validateColor}
													onChange={this.handleInputChange}
												/>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
				<div className="pt-4">
					<Button
						block
						type="primary"
						size="large"
						className="operator-controls__save-button"
						disabled={this.isSaveDisabled()}
						onClick={this.addTheme}
					>
						Save
					</Button>
				</div>
			</Modal>
		);
	}
}

AddTheme.defaultProps = {
	isOpen: bool.isRequired,
	onCloseDialog: func.isRequired,
	themes: object.isRequired,
	selectedTheme: string.isRequired,
};

export default AddTheme;
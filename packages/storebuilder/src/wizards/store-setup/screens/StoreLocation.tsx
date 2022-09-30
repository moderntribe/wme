import React from'react';
import {
	Autocomplete,
	Grid,
	InputAdornment,
	TextField,
	Stack
} from '@mui/material';
import {
	Form,
	FormField,
	TextInput,
	WizardSectionTitle
} from '@stellarwp/wme-ui';
import Search from '@mui/icons-material/Search';
import ScreenWrapper from '@setup/ScreenWrapper';
import { useStoreSetup } from '@store/hooks';
import { StoreSetupStringData } from '@setup/data/constants';
import { StoreSetupFormItemsInterface } from '@setup/data/store-setup-screen-data';

const { storeLocation: {
	title,
	copy,
	addressLine1Placeholder,
	addressLine1Label,
	addressLine2Label,
	countryPlaceholder,
	countryLabel,
	statePlaceholder,
	cityLabel,
	postCodeLabel
} } = StoreSetupStringData;

const StoreLocation = () => {
	const {
		storeSetupState,
		setFormValue,
		getCurrentLocale,
		setRegion,
		getRegions,
		getSelectedRegion,
		getStates,
		getSelectedState
	} = useStoreSetup();

	const currentLocale = getCurrentLocale();
	const regions = getRegions();
	const selectedRegion = getSelectedRegion();
	const states = getStates();
	const selectedState = getSelectedState();

	const handleChange = (prop: keyof StoreSetupFormItemsInterface) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue(prop, event.target.value);
	};

	const handleRegionChange = (value: string) => {
		const region = regions?.filter((item) => item.label === value);
		if (region[ 0 ]?.value) {
			setRegion(region[ 0 ].value);
		}
	};

	const handleStateChange = (value: string) => {
		const state = states?.filter((item) => item.label === value);
		if (state[ 0 ]?.value) {
			setFormValue('state', state[ 0 ].value);
		}
	};

	return (
		<ScreenWrapper sx={ { maxWidth: 425 } }>
			<WizardSectionTitle
				heading={ title }
				headingVariant="h2"
				copy={ copy }
			/>
			<Form>
				<Stack spacing={ 2 }>
					<FormField
						field={
							<TextInput
								fullWidth
								onChange={ handleChange('addressLine1') }
								placeholder={ addressLine1Placeholder }
								required
								value={ storeSetupState?.form?.addressLine1?.value }
							/>
						}
						label={ addressLine1Label }
					/>
					<FormField
						field={
							<TextInput
								fullWidth
								onChange={ handleChange('addressLine2') }
								value={ storeSetupState?.form?.addressLine2?.value }
							/>
						}
						label={ addressLine2Label }
					/>
					<FormField
						field={ regions?.length > 0 && (
							<Autocomplete
								getOptionLabel={ (option) => option.label }
								isOptionEqualToValue={ (option, value) => option.value === value.value }
								options={ regions }
								onInputChange={ (_, newValue) => {
									handleRegionChange(newValue);
								} }
								renderInput={ (params) => (
									<TextField
										{ ...params }
										fullWidth
										margin={ 'dense' }
										placeholder={ countryPlaceholder }
										required
										InputProps={ {
											...params.InputProps,
											startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
											type: 'text',
										} }
									/>
								) }
								value={ selectedRegion[ 0 ] }
							/>
						) }
						label={ countryLabel }
					/>
					{ states?.length > 0 && (
						<FormField
							field={
								<Autocomplete
									disabled={ storeSetupState.isLoading }
									getOptionLabel={ (option) => option.label }
									isOptionEqualToValue={ (option, value) => option.value === value.value }
									onInputChange={ (_, newValue) => {
										handleStateChange(newValue);
									} }
									options={ states }
									renderInput={ (params) => (
										<TextField
											{ ...params }
											fullWidth
											margin={ 'dense' }
											placeholder={ statePlaceholder }
											required
											InputProps={ {
												...params.InputProps,
												startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
												type: 'text',
											} }
										/>
									) }
									value={ selectedState[ 0 ] }
								/>
							}
							label={ currentLocale }
						/>
					) }
					<Grid container flexWrap="nowrap" gap={ 2 }>
						<Grid item md={ 6 }>
							<FormField
								field={
									<TextInput
										fullWidth
										onChange={ handleChange('city') }
										placeholder={ cityLabel }
										required
										value={ storeSetupState?.form?.city?.value }
									/>
								}
								label={ cityLabel }
							/>
						</Grid>
						<Grid item md={ 6 }>
							<FormField
								field={
									<TextInput
										fullWidth
										onChange={ handleChange('postCode') }
										placeholder={ postCodeLabel }
										required
										value={ storeSetupState?.form?.postCode?.value }
									/>
								}
								label={ postCodeLabel }
							/>
						</Grid>
					</Grid>
				</Stack>
			</Form>
		</ScreenWrapper>
	);
};

export default StoreLocation;
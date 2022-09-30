import React, { createContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export interface WizardProviderStateInterface {
	lastStep: number | null;
	isLastStep: boolean;
	hideExit: boolean;
	showCloseWarning: boolean | null;
	activeDevice: string;
	hasStepped: boolean;
	showDeviceHeader: boolean;
}

export interface WizardProviderContextInterface {
	wizardState: WizardProviderStateInterface;
	currentStep: number;
	goToStep: (targetStep: number) => void;
	goToNextStep: () => void;
	goToPreviousStep: () => void;
	closeAll: () => void;
	setShowCloseWarning: (showCloseWarning: boolean) => void;
	setHideExit: (hideExit: boolean) => void;
	setActiveDevice: (device: string) => void;
	setShowDeviceHeader: (showDeviceHeader:boolean) => void;
}

const initialState: WizardProviderStateInterface = {
	lastStep: null,
	isLastStep: false,
	hideExit: false,
	showCloseWarning: null,
	activeDevice: 'desktop',
	hasStepped: false,
	showDeviceHeader: false
};

export const WizardContext =
	createContext<WizardProviderContextInterface | null>(null);

const WizardProvider = ({ children }: { children: React.ReactNode }) => {
	const [wizardState, setWizardState] =
		useState<WizardProviderStateInterface>(initialState);
	const [searchParams, setSearchParams] = useSearchParams({ step: '1' });
	const currentStep = searchParams.get('step')
		? Number(searchParams.get('step'))
		: 1;
	const navigate = useNavigate();

	useEffect(() => {
		if (wizardState.hasStepped) {
			return;
		}
		if (currentStep > 1) {
			setWizardState({
				...wizardState,
				hasStepped: true
			});
		}
	}, [currentStep]);

	const goToStep = (targetStep: number) => {
		if (typeof targetStep !== 'number') {
			return;
		}
		setSearchParams({ step: String(targetStep) });
	};

	const goToNextStep = () => {
		const nextStep = currentStep + 1;
		goToStep(nextStep);
	};

	const goToPreviousStep = () => {
		const nextStep = currentStep ? Number(currentStep) - 1 : 1;
		if (nextStep >= 1) {
			goToStep(nextStep);
		}
	};

	const closeAll = () => {
		navigate('/');
	};

	const setShowCloseWarning = (showCloseWarning: boolean) => {
		setWizardState({
			...wizardState,
			showCloseWarning
		});
	};

	const setHideExit = (hideExit: boolean) => {
		setWizardState({
			...wizardState,
			hideExit
		});
	};

	const setActiveDevice = (device: string) => {
		setWizardState({
			...wizardState,
			activeDevice: device
		});
	};

	const setShowDeviceHeader = (showDeviceHeader: boolean) => {
		setWizardState({
			...wizardState,
			showDeviceHeader
		});
	};

	return (
		<WizardContext.Provider
			value={ {
				wizardState,
				currentStep,
				goToStep,
				goToNextStep,
				goToPreviousStep,
				closeAll,
				setShowCloseWarning,
				setHideExit,
				setActiveDevice,
				setShowDeviceHeader
			} }
		>
			{ children }
		</WizardContext.Provider>
	);
};

export default WizardProvider;
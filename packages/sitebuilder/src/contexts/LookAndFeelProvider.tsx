import React, { createContext, useState } from 'react';
import { beforeUnloadListener, handleActionRequest } from '@moderntribe/wme-utils';
import LookAndFeelScreenData, { LookAndFeelInterface } from '@sb/wizards/look-and-feel/data/look-and-feel-screen-data';
import { useWizard } from '@sb/hooks';
import { kadenceImport } from '@sb/utils/kadenceImport';
import { FTC_PROPS, LOOK_AND_FEEL_PROPS } from '@sb/constants';
import { __ } from '@wordpress/i18n';

export interface LookAndFeelProviderContextInterface {
  lookAndFeelState: LookAndFeelInterface;
  templates: any;
  setTemplateValue: (val: {slug: string, url: string, name: string}) => void;
  setFontValue: (font: string) => void;
  setColorValue: (color: string) => void;
  handleUpdateIframe: () => void;
  setImportingError: () => void;
  setImportDone: (status: boolean) => void;
  ajaxDelete: () => void;
  initImport: () => void;
  setShowDeleteWarning: (status:boolean) => void;
  setDeleteValue: (val: string) => void;
  handleImport: (val: string) => void;
  ajaxTemplateData: () => void;
}

export const LookAndFeelContext = createContext<LookAndFeelProviderContextInterface | null>(null);

const LookAndFeelProvider = ({ children }: { children: React.ReactNode }) => {
	const { goToNextStep } = useWizard();
	const [lookAndFeelState, setLookAndFeelState] = useState<LookAndFeelInterface>(LookAndFeelScreenData());
	const [templates, setTemplates] = useState();
	const { kadence } = LOOK_AND_FEEL_PROPS;
	const kadenceNonce = kadence.ajax.nonce;
	const logoId = FTC_PROPS?.site?.logo?.id || {};

	const setTemplateValue = (val: { slug: string, url: string, name: string}) => {
		const { name, slug, url } = val;

		setLookAndFeelState({
			...lookAndFeelState,
			template: {
				name,
				slug,
				url,
			}
		});
		goToNextStep();
	};

	const setFontValue = (font: string) => {
		setLookAndFeelState({
			...lookAndFeelState,
			font,
		});
	};

	const setColorValue = (color: string) => {
		setLookAndFeelState({
			...lookAndFeelState,
			color,
		});
	};

	const handleUpdateIframe = () => {
		setLookAndFeelState({
			...lookAndFeelState,
			updateIframe: ! lookAndFeelState.updateIframe,
		});
	};

	const setShowDeleteWarning = (status:boolean) => {
		setLookAndFeelState({
			...lookAndFeelState,
			showDeleteWarning: status,
		});
	};

	const setImportingError = () => {
		setLookAndFeelState({
			...lookAndFeelState,
			importingError: ! lookAndFeelState.importingError,
		});
	};

	const setImportDone = (status: boolean) => {
		setLookAndFeelState({
			...lookAndFeelState,
			importDone: status,
		});
	};

	const setDeleteValue = (value: string) => {
		setLookAndFeelState({
			...lookAndFeelState,
			deleteValue: value,
		});
	};

	// AJAX request to Kadence. Deletes past template data from a previous import.
	// This should only be called if the user selected the delete option in the screen warning.
	const ajaxDelete = async () => {
		const data = {
			action: 'kadence_remove_past_import_data',
			security: kadenceNonce,
			builder: 'blocks',
			selected: lookAndFeelState.template.slug,
		};

		await kadenceImport(data);
	};

	// AJAX request to Kadence. Sets template, imports fonts, images, colors.
	const ajaxDemoData = async () => {
		const data = {
			action: 'kadence_import_demo_data',
			security: kadenceNonce,
			builder: 'blocks',
			font: lookAndFeelState.font,
			palette: lookAndFeelState.color,
			selected: lookAndFeelState.template.slug,
		};

		const response = await kadenceImport(data);

		// Rerun ajax call if there's a timeout (which is highly likely if it's a new theme, this is expected).
		if (typeof response.status !== 'undefined' && response.status === 'newAJAX') {
			ajaxDemoData();
		} else {
			saveWizardSettings();
		}
	};

	// AJAX request to Kadence. Passes template data to customizer so it can be customized in WP.
	const ajaxCustomizer = async () => {
		const data = {
			action: 'kadence_import_customizer_data',
			security: kadenceNonce,
			wp_customize: 'on'
		};

		await kadenceImport(data);
	};

	// AJAX request to Kadence. Finishes import process.
	const ajaxAfter = async () => {
		const data = {
			action: 'kadence_after_import_data',
			security: kadenceNonce,
			wp_customize: 'on',
		};

		await kadenceImport(data);
	};

	// AJAX request to Kadence. Gets the templates and filters only the ecommerce ones.
	const ajaxTemplateData = async () => {
		const data = {
			action: 'kadence_import_get_template_data',
			security: kadenceNonce,
		};

		try {
			const response = await kadenceImport(data);
			const jsonResponse = Object.values(JSON.parse(response)).filter(((template:any) => template.ecommerce)) as any;
			setTemplates(jsonResponse);
		} catch (error) {
			const errorMessage = __('Something went wrong with importing theme data. Please refresh and try the import again.', 'nexcess-mapps');
			// eslint-disable-next-line no-alert
			alert(errorMessage);
		}
	};

	// Triggered on save. Determines if delete warning should be shown.
	const initImport = () => {
		if ((LOOK_AND_FEEL_PROPS?.template === '') || (lookAndFeelState.template.slug === LOOK_AND_FEEL_PROPS?.template?.slug)) {
			handleImport('keep');
		} else {
			setShowDeleteWarning(true);
		}
	};

	// Starts importing process.
	const handleImport = async (val: string) => {
		setShowDeleteWarning(false);

		if (val === 'delete') {
			await ajaxDelete();
		}

		await ajaxDemoData();
	};

	// Sets logo back to what the user set it as in the FTC. Kadence will replace the logo with the template logo, so this is a workaround to avoid that.
	const setLogo = async () => {
		const logoPayload = {
			_wpnonce: FTC_PROPS?.ajax?.nonce || '',
			action: FTC_PROPS?.ajax?.action || '',
			sub_action: 'finish',
			logo: logoId,
		};

		handleActionRequest(logoPayload)
			.catch((err:JQueryXHR) => {
				const errorMessage = err?.responseJSON?.message;
				// eslint-disable-next-line no-console
				console.error(errorMessage + errorMessage);
			});
	};

	// Saves settings, sends data to backend.
	const saveWizardSettings = async () => {
		const data = {
			_wpnonce: LOOK_AND_FEEL_PROPS.ajax?.nonce || '',
			action: LOOK_AND_FEEL_PROPS.ajax?.action || '',
			sub_action: 'finish',
			template: lookAndFeelState.template,
			font: lookAndFeelState.font,
			color: lookAndFeelState.color,
		};

		await ajaxCustomizer();
		await ajaxAfter();
		setImportDone(true);

		// Set logo back to what it was before import.
		await setLogo();

		await handleActionRequest(data).then(() => {
			removeEventListener('beforeunload', beforeUnloadListener);

			// Delay 1 second to show progress bar got to 100%.
			setTimeout(() => {
				goToNextStep();
			}, 1000);
		}).catch((err:JQueryXHR) => {
			const errorMessage = err?.responseJSON?.message;
			// eslint-disable-next-line no-console
			console.error(errorMessage + errorMessage);
		});
	};

	return (
		<LookAndFeelContext.Provider value={ {
			lookAndFeelState,
			templates,
			setTemplateValue,
			setFontValue,
			setColorValue,
			setDeleteValue,
			handleUpdateIframe,
			setImportingError,
			setImportDone,
			setShowDeleteWarning,
			ajaxDelete,
			initImport,
			handleImport,
			ajaxTemplateData
		} }>
			{ children }
		</LookAndFeelContext.Provider>
	);
};

export default LookAndFeelProvider;

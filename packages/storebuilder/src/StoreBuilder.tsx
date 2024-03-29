import { lazy } from 'react';
import { UI_THEME, SB_THEME } from '@store/constants';
import {
	Experimental_CssVarsProvider as CssVarsProvider,
	experimental_extendTheme as extendTheme
} from '@mui/material/styles';
import { theme as WME_THEME } from '@moderntribe/wme-ui';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import StoreBuilderProvider from '@store/contexts/StoreBuilderProvider';
import WizardProvider from '@store/contexts/WizardProvider';
import WizardWrapper from '@store/wizards/WizardWrapper';
import Loadable from '@store/components/Loadable';
import { getUITheme } from '@moderntribe/wme-utils';

const defaultTheme = extendTheme(WME_THEME, { ...SB_THEME, cssVarPrefix: 'wme' });
const storeBuilderTheme = extendTheme(defaultTheme, getUITheme(UI_THEME));
// @ts-ignore
delete storeBuilderTheme?.colorSchemes?.dark;
const SetupScreen = Loadable(lazy(() => import('@store/setup/SetupScreen')));

const StoreBuilder = () => (
	<CssVarsProvider theme={ storeBuilderTheme }>
		<StoreBuilderProvider>
			<HashRouter>
				<Routes>
					<Route path="/" element={ <SetupScreen fullscreen={ true } /> } />
					<Route path="/wizard/*" element={ <WizardProvider><WizardWrapper /></WizardProvider> } />
					<Route path="*" element={ <Navigate to="/" /> } />
				</Routes>
			</HashRouter>
		</StoreBuilderProvider>
	</CssVarsProvider>
);

export default StoreBuilder;

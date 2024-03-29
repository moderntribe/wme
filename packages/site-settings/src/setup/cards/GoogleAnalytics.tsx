import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Form,
	FormField,
	TextInput
} from '@moderntribe/wme-ui';
import { Link, styled } from '@mui/material';

const StyledFormField = styled(FormField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	'& .MuiInputBase-root': {
		width: '100%',
	}
}));

const GoogleAnalytics = () => {
	const [analyticsScript, setAnalyticsScript] = useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAnalyticsScript(event.target.value);
	};

	return (
		<Form>
			<StyledFormField
				label={
					<>
						{ __('Google Analytics Code', 'moderntribe-sitebuilder') }
						{ ' ' }
						<Link
							href="/"
							target="_blank"
							rel="noopener">
							{ __('(How do I set this up?)', 'moderntribe-sitebuilder') }
						</Link>
					</>
				}
				field={
					<TextInput
						value={ analyticsScript }
						onChange={ handleChange }
						name="analyticsScript"
						multiline
						minRows={ 5 }
						placeholder={ __('Paste your code from Google here', 'moderntribe-sitebuilder') }
					/>
				}
			/>
			<Button
				variant="contained"
				color="primary">
				{ __('Save', 'moderntribe-sitebuilder') }
			</Button>
		</Form>
	);
};

export default GoogleAnalytics;

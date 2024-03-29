import {
	FormField,
	Form,
	ChipInput,
	SelectInput
} from '@moderntribe/wme-ui';
import { Box, MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useFirstTimeConfiguration } from '@sb/hooks';
import { useEffect, useState } from 'react';
import { FtcStringData } from '@ftc/data/constants';
import PageWrapper from '@ftc/components/PageWrapper';
import { FtcFormItemsInterface } from '../data/ftc-form';

const { keywords, contentPersonality } = FtcStringData;

const ContentTone = () => {
	const {
		ftcState: { form, personalityOptions },
		setFormValue,
		shouldBlockNextStep
	} = useFirstTimeConfiguration();
	const [keywordCount, setKeywordCount] = useState(0);

	const updateKeywords = (tags: string[]) => {
		setFormValue('siteKeywords', tags);
	};

	const handleChange = (prop: keyof FtcFormItemsInterface) => (event: SelectChangeEvent<any>) => {
		setFormValue(prop, event.target.value);
	};

	useEffect(() => {
		if (! form) {
			return;
		}
		shouldBlockNextStep(! form.siteKeywords.value || ! form.sitePersonality.value);
		setKeywordCount(form.siteKeywords.value?.length || 0);
	}, [form]);

	return (
		<PageWrapper>
			<Form>
				<Stack spacing={ 4 }>
					<Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
						<Typography variant="h3">{ keywords.title }</Typography>
						<Typography variant="body2" sx={ { color: 'text.secondary', marginBottom: '8x' } }>{ keywords.description }</Typography>
						<FormField
							field={
								<ChipInput
									rows={ 3 }
									selectedTags={ updateKeywords }
									placeholder={
										keywords.placeholder
									}
									required
									tags={ form.siteKeywords.value }
								/>
							}
							helperText={
								<Box sx={ { display: 'flex', justifyContent: 'space-between', width: '100%' } }>
									<Typography variant="subtext" color="text.disabled">{ keywords.helperText }</Typography>
									<Typography variant="subtext" color={ keywordCount >= 5 ? 'success.main' : 'error.main' }>{ keywordCount }/10</Typography>
								</Box>
							}
						/>
					</Box>
					<Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
						<Typography variant="h3">{ contentPersonality.title }</Typography>
						<Typography variant="body2" sx={ { color: 'text.secondary', marginBottom: '8px' } }>{ contentPersonality.description }</Typography>
						<FormField
							field={
								<SelectInput
									fullWidth
									sx={ { maxWidth: '400px' } }
									onChange={ handleChange('sitePersonality') }
									value={ form.sitePersonality.value }
								>
									{ personalityOptions.map((opt) => (
										<MenuItem key={ opt } value={ opt }>
											{ opt }
										</MenuItem>
									)) }
								</SelectInput>
							}
						/>
					</Box>
				</Stack>
			</Form>
		</PageWrapper>
	);
};

export default ContentTone;

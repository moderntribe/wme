import { formatKadencePages, useFirstTimeConfiguration, useKadencePages } from '@sb/hooks';
import { Box } from '@mui/material';
import getTemplateStyles from '../data/styles';
import { useEffect, useState } from 'react';
import KadenceTemplateItem, { TemplateSelectItemProps } from '../components/styles/KadenceTemplateItem';
import KadenceTemplateGroup from '../components/styles/KadenceTemplateGroup';
import TemplateItemSkeletonItem from '../components/styles/TemplateItemSkeleton';
import TemplateFilter, { FilterOption } from '../components/styles/TemplateFilter';

const StyleSelection = () => {
	const {
		ftcState: { form },
		setFormValue,
		shouldBlockNextStep
	} = useFirstTimeConfiguration();
	const { data, loading } = useKadencePages();
	const [pages, setPages] = useState<TemplateSelectItemProps[]>();
	const [filteredPages, setFilteredPages] = useState<TemplateSelectItemProps[]>();
	const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
	const [selectedTemplate, setTemplate] = useState(form.template.value);
	const styles = getTemplateStyles();

	useEffect(() => {
		setFormValue('template', selectedTemplate);
		shouldBlockNextStep(false, 5);
	}, [selectedTemplate]);

	useEffect(() => {
		if (! loading && data) {
			const parsed = formatKadencePages(data);
			setPages(parsed.pages);
			setFilteredPages(parsed.pages);
			setFilterOptions(parsed.filterOptions);
		}
	}, [loading, data]);

	const filterTemplates = (targets: FilterOption[]) => {
		if (targets.length > 0) {
			setFilteredPages(pages?.filter((page) => {
				for (const option of targets) {
					if (page.page_styles[ option.value ]) {
						return true;
					}
				}
				return false;
			}));
		} else {
			setFilteredPages(pages);
		}
	};

	return (
		<Box sx={ { width: '90%', minHeight: '100%', paddingTop: '48px' } }>
			<Box sx={ { display: 'flex', justifyContent: 'space-between' } }>
				<TemplateFilter
					options={ filterOptions }
					updateSelected={ filterTemplates }
				/>
				<div>
					{ filteredPages?.length || 0 } templates
				</div>
			</Box>
			<KadenceTemplateGroup>
				{ filteredPages ? filteredPages.map((page) => (
					<KadenceTemplateItem
						key={ page.slug }
						{ ...page }
						style={ styles[ page.defaultStyleIndex || 0 ] }
						onClick={ setTemplate }
						selected={ page.slug === selectedTemplate }
					/>
				)) : (
					Array.from('1234').map((key) => (
						<TemplateItemSkeletonItem key={ key } />
					))
				) }
			</KadenceTemplateGroup>
		</Box>
	);
};

export default StyleSelection;

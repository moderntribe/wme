import type React from 'react';
import type { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { FormControlLabel as MuiFormControlLabel, FormControlLabelProps } from '@mui/material';

interface FormControlProps extends FormControlLabelProps {
  control: ReactElement;
  label: string;
  value?: string;
  children?: string;
}

const StyledFormControlLabel = styled(MuiFormControlLabel, {
  name: 'WmeFormControlLabel',
  slot: 'Root',
})<FormControlProps>(() => ({
  '& .MuiTypography-root': {
    fontSize: 14,
    textAlign: 'left',
  },
}));

const FormControlLabel: React.FC<FormControlProps> = (props) => {
  const { children, ...rest } = props;

  return (
    <StyledFormControlLabel className="WmeFormControlLabel-root" {...rest}>
      {children}
    </StyledFormControlLabel>
  );
};

export default FormControlLabel;

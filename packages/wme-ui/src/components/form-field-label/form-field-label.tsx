import type React from 'react';
import type { PropsWithChildren } from 'react';
import { InputLabel, InputLabelProps, styled } from '@mui/material';

const StyledFormFieldLabel = styled(InputLabel, {
  name: 'WmeFormFieldLabel',
  slot: 'Root',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 5,
  textAlign: 'left',
}));

const FormFieldLabel: React.FC<PropsWithChildren<InputLabelProps>> = ({
  children,
  ...props
}) => (
  <StyledFormFieldLabel className="WmeFormFieldLabel-root" {...props}>
    {children}
  </StyledFormFieldLabel>
);
export default FormFieldLabel;

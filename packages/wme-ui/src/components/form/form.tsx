import type React from 'react';
import { Box, BoxProps, styled } from '@mui/material';

const StyledForm = styled(Box, {
  name: 'WmeForm',
  slot: 'Root',
})({}) as typeof Box;

const Form: React.FC<BoxProps> = ({ children, ...props }) => (
  <StyledForm
    autoComplete="off"
    className="WmeForm-root"
    component="form"
    noValidate
    {...props}
  >
    {children}
  </StyledForm>
);

export default Form;

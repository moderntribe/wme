import type React from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import type { FormControlUnstyledProps } from '@mui/base';
import {
  InputError,
  FormFieldControl,
  InputHelperText,
  FormFieldLabel,
} from '..';

type FormFieldProps = FormControlUnstyledProps & {
  errorMessage?: string;
  field?: ReactNode;
  helperText?: string | React.ReactElement;
  id?: string;
  label?: string | React.ReactElement;
};

const FormField: React.FC<PropsWithChildren<FormFieldProps>> = ({
  children,
  errorMessage,
  field,
  helperText,
  id,
  label,
  ...props
}) => (
  <FormFieldControl className="WmeFormFieldControl-root" {...props}>
    {label && <FormFieldLabel>{label}</FormFieldLabel>}
    {field}
    {errorMessage && <InputError>{errorMessage}</InputError>}
    {helperText && <InputHelperText>{helperText}</InputHelperText>}
    {children}
  </FormFieldControl>
);

export default FormField;

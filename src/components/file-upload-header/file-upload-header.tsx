import React from 'react';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { Box, styled } from '@mui/material';
import { InputTitle } from '..';

const StyledFileUploadHeader = styled(Box, {
  name: 'WmeFileUploadHeader',
  slot: 'Root',
})({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  '& .WmeErrorText': {
    cursor: 'pointer',
    marginLeft: 'auto',
  },
});

const StyledButton = styled(ButtonUnstyled, {
  name: 'WmeFileUploadHeaderButton',
  slot: 'Root',
})(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.palette.error.main,
  cursor: 'pointer',
  margin: 0,
  padding: 0,
}));

export interface FileUploadHeaderProps {
  buttonText?: string;
  fileUploaded?: boolean;
  labelText?: string;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
}

const FileUploadHeader: React.FC<FileUploadHeaderProps> = ({
  buttonText,
  fileUploaded,
  labelText,
  onRemove,
  ...props
}) => (
  <StyledFileUploadHeader
    className={StyledFileUploadHeader.displayName}
    {...props}
  >
    {labelText && <InputTitle>{labelText}</InputTitle>}
    {fileUploaded && (
      <StyledButton onClick={onRemove}>{buttonText}</StyledButton>
    )}
  </StyledFileUploadHeader>
);

export default FileUploadHeader;
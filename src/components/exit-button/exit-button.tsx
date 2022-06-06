import React, { ReactElement } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout } from '@mui/icons-material';
import { Button } from '..';

interface ExitButtonProps extends BoxProps {
  children?: ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const ExitButtonContainer = styled(Box, {
  name: 'WmeExitButton',
  slot: 'Root',
})(() => ({
  margin: 0,
}));

const ExitButton: React.FC<ExitButtonProps> = (props) => {
  const { children, onClick, ...rest } = props;

  return (
    <ExitButtonContainer className={ExitButtonContainer.displayName} {...rest}>
      <Button onClick={onClick}>
        {children}
        <Logout sx={{ ml: 1 }} />
      </Button>
    </ExitButtonContainer>
  );
};

export default ExitButton;
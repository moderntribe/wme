import type React from 'react';
import { Chip as MuiChip, ChipProps, styled } from '@mui/material';

const StyledChip = styled(MuiChip, {
  name: 'WmePasswordInputChip',
  slot: 'Root',
})(({ theme }) => ({
  height: 26,
  '&.MuiChip-filledSuccess': {
    backgroundColor: theme.palette.success,
    color: theme.palette.text.white,
  },
  '&.MuiChip-filledWarning': {
    backgroundColor: theme.palette.warning,
    color: theme.palette.text.white,
  },
  '&.MuiChip-filledError': {
    backgroundColor: theme.palette.error,
    color: theme.palette.text.white,
  },
}));

const Chip: React.FC<ChipProps> = ({ color, label, ...props }) => (
  <StyledChip
    className="WmePasswordInputChip-root"
    color={color}
    label={label}
    {...props}
  />
);

export default Chip;

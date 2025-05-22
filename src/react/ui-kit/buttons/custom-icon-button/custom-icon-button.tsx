import type { ButtonProps } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ICONS } from '@react-ui-kit/icons/icon-paths';

export interface ICustomButton extends ButtonProps {
  width: number;
  height: number;
  tooltipText?: string;
  tooltipPlacement?:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';
  icon: (typeof ICONS)[keyof typeof ICONS];
  iconStyle?: CSSProperties;
}

export const CustomIconButton = ({
  width,
  height,
  icon,
  tooltipPlacement = 'top',
  tooltipText,
  iconStyle,
  ...rest
}: ICustomButton) => {
  return (
    <>
      {tooltipText === '' ? (
        <IconButton {...rest}>
          <Image
            src={icon}
            width={width}
            height={height}
            alt="icon"
            style={iconStyle}
          />
        </IconButton>
      ) : (
        <Tooltip title={tooltipText} placement={tooltipPlacement}>
          <IconButton {...rest}>
            <Image
              src={icon}
              width={width}
              height={height}
              alt="icon"
              style={iconStyle}
            />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

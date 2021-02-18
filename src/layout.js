import {css, jsx} from '@emotion/react';
import { withStyles } from '@material-ui/core/styles';
import { Slider, Typography } from '@material-ui/core';


const bColor = 'black';


export const theme = css`
	width: 100vw;
	height: 100vh;
	background-color: ${bColor};
`;

export const ControllerLeft = css`
	position: absolute;
	width: 20vw;
	height: 10vh;
	left:20px;
	top: 200px;
`;

export const ControllerRight = css`
	position: absolute;
	width: 20vw;
	height: 10vh;
	right:20px;
	top: 200px;
`;

export const SliderTitleText = withStyles({
	root: {
		color: "#FFFFFF"
	}
})(Typography);

export const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

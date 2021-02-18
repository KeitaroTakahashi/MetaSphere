/** @jsxImportSource @emotion/react */
import { css, jsx, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';

const bColor = 'blue';

const theme = css`
	width: 100vw;
	height: 50vw;
	background-color: ${bColor};
`;

export const Controller = () => (
	<div css={theme}>
		
	</div>
);
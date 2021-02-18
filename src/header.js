/** @jsxImportSource @emotion/react */
import { css, jsx, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import logoText from './Materials/image/logo/title_horizontal_1_200.png';

const bColor = 'lightgray';

const theme = css`
	width: 100vw;
	height: 80px;
	background-color: ${bColor};
`;

const tableTheme = css`
	width: 100vw;
	height: 80px;
`;

const tdTheme = css`
	width: 50%;
	height: 80px;
`;


const titleText = css`
	margin: 0 auto;
	font-family: 'Helvetica Neue';
	font-size: 40px;
	line-height:80px;
	vertical-align: middle;
`;

const logoTextTheme = css`
	width: 200px;
`;

const logoTextPos = css`
	line-heiight:80px;
	margin-top: 15px;
	margin-right:20px;
	text-align: right;
`;

export const Header = () => (
	<div css={theme}>
	<table css={tableTheme}>
	<thead>
		<tr>
			<td>
				<div css={titleText}>
					<p> MetaSphere </p>
				</div>
			</td>
			<td>
				<div css={logoTextPos}>
					<img src={logoText} css={logoTextTheme} alt="logo" />
				</div>
			</td>
		</tr>
		</thead>
	</table>

	</div>
);
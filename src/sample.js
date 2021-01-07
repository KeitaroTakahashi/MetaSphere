import { css, jsx } from '@emotion/core'

const color = 'white'
const theme = css`
	padding: 32px;
	background-color: hotpink;
	font-size: 24px;
	border-radius: 4px;
	&:hover { color: ${color}};
	`

	render(
		<div css={theme}>
			Hover to change color
		</div>
		)
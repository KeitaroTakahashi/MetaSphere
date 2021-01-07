/** @jsxImportSource @emotion/react */

import {useRef} from 'react';
import {Canvas, useFrame} from 'react-three-fiber';
import {css, jsx} from '@emotion/react';

const bColor = 'black';
const theme = css`
	width: 100vw;
	height: 100vh;
	background-color: ${bColor};
`;

const Thing = () => {
	const ref = useRef();

	useFrame(({clock})=>{
		ref.current.position.x += Math.cos(clock.getElapsedTime()) * 3;
		ref.current.position.y += Math.sin(clock.getElapsedTime()) * 3;
		ref.current.position.z += Math.cos(clock.getElapsedTime()) * 3;
		ref.current.rotation.y += 0.01;
	});

	return (
		<mesh ref={ref}
			  onClick={console.log('sphere clicked!')}
		>
			<sphereGeometry attach='geometry' args={[300,100,100]} />
			<meshStandardMaterial attach='material' color='#FFFF00' />
		</mesh>

		);
};

export const Work = () => (
	<div css={theme}>
		<Canvas camera={{ position: [0, 0, 1000] }}>
			<pointLight
				color='#FFFFFF'
				intensity={0.4}
				position={[0, 2000, 1000]}
			/>
			<pointLight
				color='white'
				intensity={0.4}
				position={[0, 0, 1000]}
			/>
			<Thing />
		</Canvas>
	</div>
);


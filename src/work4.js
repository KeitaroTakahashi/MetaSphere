/** @jsxImportSource @emotion/react */

import * as THREE from 'three';
import * as CANNON from 'cannon';
import React, {useEffect, useState} from 'react'
import {Canvas, useFrame} from 'react-three-fiber'
import {css, jsx} from '@emotion/react'
import { useCannon, Provider } from './work4_pe'

const theme = css`
	width: 100vw;
	height: 100vh;
	background-color: #272727;	
`
const Plane = ({position})=> {
	const ref=useCannon({mass:0}, body=>{
		body.addShape(new CANNON.Plane())
		body.position.set(...position)
	})

	return (
		<mesh ref={ref} 
			  onClick={(e) => e.stopPropagation() || console.log('plane clicked.')}
			  receiveShadow
		>
			<planeBufferGeometry attach='geometry' args={[1000,1000]} />
			<meshPhongMaterial attach='material' color='#272727' />
		</mesh>
		)
}
const Box = ({position, args}) => {
	const ref = useCannon({mass: 100000}, body=>{
		body.addShape(new CANNON.Box(new CANNON.Vec3(1,1,1)))
		body.position.set(...position)
	})
	return (
		<mesh ref={ref} 
		 	  onClick={(e) => e.stopPropagation() || console.log('Box Clicked!')}
			  castShadow
			  receiveShadow 
		>
			<boxGeometry attach='geometry' args={args} />
			<meshStandardMaterial attach='material' color='yellow'/>
		</mesh>
		)
}

const Sphere = ({position, args}) => {
	const sphereMat = new CANNON.Material('sphereMat')
	const ref = useCannon({mass: 10000, material: sphereMat}, body=>{
		body.addShape(new CANNON.Sphere(1))
		body.position.set(...position)
	})

	const color = "orange"

	return (
		<mesh ref={ref} castShadow receiveShadow 
			onClick={(e) => e.stopPropagation() || console.log('Sphere clicked!')}>
		<sphereGeometry attach='geometry' args={args} />
		<meshStandardMaterial attach='material' color={color}/>
		</mesh>
		)
}

export const Work = () => {
	return (
		<div css={theme}>
			<Canvas camera={{position: [0,5,15]}}>
				<spotLight 
					color='yellow'
					intensity={0.6}
					position={[1000, 2000, 1000]}
				/>
				<spotLight 
					color='orange'
					intensity={0.6}
					position={[1000, -2001, 1000]}
				/>
				<spotLight 
					color='orange'
					intensity={0.6}
					position={[100, -1001, 1000]}
				/>
				<spotLight 
					color='white'
					intensity={0.6}
					position={[-1000, -2001, -1000]}
				/>

				<Provider>
					<Plane position={[0,0,-30]} />
					<Box position={[-10, 0, 1]} args={[2,2,2]} />
					<Box position={[1, 0, 1]} args={[1,1,5]} />
					<Box position={[2, 1, 5]} args={[3,3,3]} />
					<Box position={[-4, 3, 5]} args={[5,2,1]} />
					<Box position={[-1, 1, 8]} args={[2,3,2]} />
					<Box position={[-4, 5, 8]} args={[5,3,2]} />
					<Sphere position={[4, 3, 7]} args={[2,30,30]} />
					<Sphere position={[1, 0, 3]} args={[2,30,30]} />
					<Sphere position={[-5, -10, 10]} args={[5,30,30]} />
					<Sphere position={[12, 10, 6]} args={[3,30,30]} />
					<Sphere position={[9, 5, 9]} args={[7,30,30]} />

				</Provider>
			</Canvas>
		</div>
	)
}
import { throttle } from 'lodash-es';
import { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.scss';
import Router from './router';

// rem 响应式布局方案
const rootWidth = 1920;
const defaultFontSize = 14;
document.documentElement.style.fontSize = (100 / rootWidth) * defaultFontSize + 'vw';

function App() {
	const [screenRotate, setScreenRotate] = useState(false);

	// 自动旋转
	useEffect(() => {
		const resizeCallback = throttle(() => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const idRotate = height > width;
			setScreenRotate(idRotate);
			document.documentElement.style.fontSize = (100 / rootWidth) * defaultFontSize + (idRotate ? 'vh' : 'vw');
		}, 200);
		window.addEventListener('resize', resizeCallback);

		resizeCallback();
		return () => {
			window.removeEventListener('resize', resizeCallback);
		};
	});

	const containerEleStyle = {
		'--width': `${screenRotate ? '100vh' : '100vw'}`,
		'--height': `${screenRotate ? '100vw' : '100vh'}`,
		'--rotate-angle': `${screenRotate ? '90deg' : '0deg'}`,
		'--translate-x': `${screenRotate ? '100vw' : '0'}`
	} as React.CSSProperties;
	return (
		<HashRouter>
			<main className='container' style={containerEleStyle}>
				<Router />
			</main>
		</HashRouter>
	);
}

export default App;

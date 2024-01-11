import { HashRouter } from 'react-router-dom';
import './App.scss';
import Router from './router';

const rootWidth = 1920;
const defaultFontSize = 14;
document.documentElement.style.fontSize = (100 / rootWidth) * defaultFontSize + 'vw';

function App() {
	return (
		<HashRouter>
			<main className='container'>
				<Router />
			</main>
		</HashRouter>
	);
}

export default App;

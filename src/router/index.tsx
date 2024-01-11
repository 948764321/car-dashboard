import Dashboard from '@/views/dashboard';
import { useRoutes } from 'react-router-dom';

export const rootRouter = [
	{
		path: '/',
		element: <Dashboard />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;

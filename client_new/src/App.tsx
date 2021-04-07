import './App.css';
import { connect } from 'react-redux';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RouteConfig } from './routes';
import AuthRoute from './components/AuthRoute';

const App = () => (
	<Router>
		<Switch>
			{RouteConfig.map((route, i) => (
				<RouterWithSubRoutes key={i} {...route} />
			))}
		</Switch>
	</Router>
);

const RouterWithSubRoutes = (route: any) =>
	route.requiresAuth ? (
		<AuthRoute
			path={route.path}
			render={(props: any) => <route.component {...props} routes={route.routes} />}
		/>
	) : (
		<Route
			path={route.path}
			render={(props) => <route.component {...props} routes={route.routes} />}
		/>
	);
export default connect()(App);

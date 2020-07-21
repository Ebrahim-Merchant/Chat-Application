import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ChatPage from './pages/chat-page';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './pages/login-page';


const RouterFunction = () => (
	<Router>
			<Switch>
				<Route exact path='/'>
					<ChatPage />
				</Route>
				<Route path='/login'>
					<LoginPage />
				</Route>
			</Switch>
	</Router>
);

ReactDOM.render(<RouterFunction />, document.getElementById('root'));

serviceWorker.unregister();

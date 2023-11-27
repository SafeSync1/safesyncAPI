import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter} from 'react-router-dom'
import {LoginOrNot} from './processes/userData'

const root = ReactDOM.createRoot(document.getElementById('root'));

LoginOrNot().then((result) => {
	
	root.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
})


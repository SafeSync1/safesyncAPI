
import { Routes, Route } from 'react-router-dom'

import './index.css'

import Login from './components/Login' 

function App() {
	return (
		<>
			<Routes>
				<Route exact path='/Login' element={<Login />}/>
			</Routes>
		</>
	);
}

export default App;


import { Routes, Route } from 'react-router-dom'

import './index.css'

import Login from './components/Login' 
import Otp from './components/Otp'
import Register from './components/Register'
import Home from './components/Home'

function App() {
	return (
		<>
			<Routes>
				<Route exact path='/Login' element={<Login />}/>
				<Route exact path="/Otp" element={<Otp /> } />
				<Route exact path="/Register" element={<Register /> } />
				<Route exact path='/Home' element={<Home />} />
			</Routes>
		</>
	);
}

export default App;

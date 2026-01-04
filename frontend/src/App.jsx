import { Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

function App() {
  

  return (
<div className='min-h-screen overflow-hidden bg-gray-900 relative text-white'>
{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

<div className='relative z-50 pt-20'>
    <Navbar />
  <Routes>
    <Route path='/' element={<Homepage />} />
    <Route path='/signup' element={<SignupPage />} />
    <Route path='/login' element={<LoginPage />} />
  </Routes>
  </div>
</div>
  )
}

export default App

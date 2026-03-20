import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Screenings from './pages/Screenings'
import Events from './pages/Events'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <Box component='main' sx={{ pt: '64px' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/screenings' element={<Screenings />} />
          <Route path='/events' element={<Events />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App

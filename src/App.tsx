import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Screenings from './pages/Screenings'
import ScreeningDetail from './pages/ScreeningDetail'
import Events from './pages/Events'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Contact from './pages/Contact'
import Community from './pages/Community'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <Box component='main' sx={{ pt: '64px' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/screenings' element={<Screenings />} />
          <Route path='/screenings/:id' element={<ScreeningDetail />} />
          <Route path='/events' element={<Events />} />
          <Route path='/community' element={<Community />} />
          <Route path='/community/:id' element={<PostDetail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App

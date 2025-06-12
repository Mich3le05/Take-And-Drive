import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import Profile from './pages/Profile'
import Login from './components/Login'
import Register from './components/Register'
import VehiclesDetails from './components/VehiclesDetails'
import Reservations from './components/Reservations'

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehiclesDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App

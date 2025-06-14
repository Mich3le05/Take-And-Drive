import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import './assets/css/App.css'
import 'leaflet/dist/leaflet.css'

import NotFound from './components/NotFound'
import MyNav from './components/MyNav'
import MyFooter from './components/MyFooter'
import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import Profile from './pages/Profile'

import VehicleDetail from './components/VehicleDetail'

function App() {
  return (
    <Router>
      <MyNav />
      <main className="body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="*"
            element={
              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                  <NotFound />
                </Col>
              </Row>
            }
          />
        </Routes>
      </main>
      <footer>
        <MyFooter />
      </footer>
    </Router>
  )
}

export default App

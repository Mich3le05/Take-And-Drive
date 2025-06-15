import {
  Col,
  Container,
  Row,
  Button,
  Toast,
  ToastContainer,
  Form,
  Alert,
  Card,
  Nav,
  Tab,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Loading from '../components/Loading'
import Error from '../components/Error'
import Reservations from '../components/Reservations'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login') // 'login' o 'register'
  const [profileTab, setProfileTab] = useState('info') // 'info' o 'reservations'

  // Nuovo stato per le statistiche delle prenotazioni
  const [reservationStats, setReservationStats] = useState({
    total: 0,
    past: 0,
    future: 0,
    current: 0,
  })

  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Carica le statistiche quando l'utente è autenticato
    if (userInfo) {
      loadReservationStats()
    }
  }, [userInfo])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        console.log('Token decodificato:', decoded)
        setUserInfo(decoded)
      } catch (error) {
        console.error('Errore nel decodificare il token:', error)
        localStorage.removeItem('token') // Rimuovi token invalido
      }
    }
  }

  const loadReservationStats = async () => {
    try {
      const token = localStorage.getItem('token')

      // Carica tutte le prenotazioni per le statistiche
      const [allRes, pastRes, futureRes] = await Promise.all([
        fetch('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/reservations/past', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/reservations/future', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (allRes.ok && pastRes.ok && futureRes.ok) {
        const [allData, pastData, futureData] = await Promise.all([
          allRes.json(),
          pastRes.json(),
          futureRes.json(),
        ])

        // Calcola prenotazioni correnti (in corso oggi)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const currentReservations = allData.filter((res) => {
          const start = new Date(res.startDate)
          const end = new Date(res.endDate)
          start.setHours(0, 0, 0, 0)
          end.setHours(0, 0, 0, 0)
          return start <= today && end >= today
        })

        setReservationStats({
          total: allData.length,
          past: pastData.length,
          future: futureData.length,
          current: currentReservations.length,
        })
      }
    } catch (error) {
      console.error('Errore nel caricamento delle statistiche:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) throw new Error('Credenziali non valide')

      const data = await response.json()
      localStorage.setItem('token', data.token)
      checkAuth()
      setToastMessage('Login eseguito con successo!')
      setShowToast(true)
      resetForm()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    // Validazione password
    if (password !== confirmPassword) {
      setErrorMessage('Le password non coincidono')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMessage('La password deve essere di almeno 6 caratteri')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Errore durante la registrazione')
      }

      setToastMessage('Registrazione completata! Ora puoi effettuare il login.')
      setShowToast(true)
      setActiveTab('login')
      resetForm()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserInfo(null)
    setReservationStats({ total: 0, past: 0, future: 0, current: 0 })
    setToastMessage('Logout eseguito con successo!')
    setShowToast(true)
    // Opzionale: reindirizza alla homepage
    // navigate('/')
  }

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setErrorMessage('')
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  return (
    <Container fluid className="font text-color p-5">
      <Row className="mt-3">
        <Col xs={12}>
          {userInfo ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="titoli-font text-center flex-grow-1">
                  {userInfo.roles?.includes('ROLE_ADMIN')
                    ? 'Bentornato Admin!'
                    : `Ciao, ${userInfo.username || userInfo.sub}!`}
                </h1>
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  className="ms-3"
                >
                  Esci
                </Button>
              </div>

              <Tab.Container
                activeKey={profileTab}
                onSelect={(k) => setProfileTab(k)}
                className="w-100"
              >
                <Card>
                  <Card.Header>
                    <Nav variant="tabs">
                      <Nav.Item>
                        <Nav.Link eventKey="info">
                          Informazioni Profilo
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="reservations">
                          Le mie Prenotazioni
                          {reservationStats.total > 0 && (
                            <Badge bg="primary" className="ms-1">
                              {reservationStats.total}
                            </Badge>
                          )}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>

                  <Card.Body>
                    <Tab.Content>
                      <Tab.Pane eventKey="info">
                        <div className="text-center mb-4">
                          <Card.Title>Il tuo profilo</Card.Title>
                          <Card.Text>
                            <strong>Username:</strong>{' '}
                            {userInfo.username || userInfo.sub}
                          </Card.Text>
                        </div>

                        {/* Statistiche prenotazioni */}
                        <Row className="g-3">
                          <Col md={3} sm={6}>
                            <Card className="text-center bg-primary text-white">
                              <Card.Body>
                                <h3>{reservationStats.total}</h3>
                                <small>Totale Prenotazioni</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} sm={6}>
                            <Card className="text-center bg-success text-white">
                              <Card.Body>
                                <h3>{reservationStats.past}</h3>
                                <small>Completate</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} sm={6}>
                            <Card className="text-center bg-warning text-white">
                              <Card.Body>
                                <h3>{reservationStats.current}</h3>
                                <small>In Corso</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} sm={6}>
                            <Card className="text-center bg-info text-white">
                              <Card.Body>
                                <h3>{reservationStats.future}</h3>
                                <small>Future</small>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="reservations">
                        <Reservations />
                      </Tab.Pane>
                    </Tab.Content>
                  </Card.Body>
                </Card>
              </Tab.Container>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-center">Il tuo Profilo</h2>

              <Card>
                <Card.Header>
                  <Nav variant="tabs" defaultActiveKey="login">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="login"
                        active={activeTab === 'login'}
                        onClick={() => switchTab('login')}
                      >
                        Login
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="register"
                        active={activeTab === 'register'}
                        onClick={() => switchTab('register')}
                      >
                        Registrati
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  {errorMessage && (
                    <Alert variant="danger" className="mb-3">
                      {errorMessage}
                    </Alert>
                  )}

                  {activeTab === 'login' ? (
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? <Loading /> : 'Accedi'}
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <Form onSubmit={handleRegister}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Conferma Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button
                          variant="success"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? <Loading /> : 'Registrati'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>

      {/* Toast per i messaggi */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notifica</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default Profile

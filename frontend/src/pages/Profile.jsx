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
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Loading from '../components/Loading'
import Error from '../components/Error'

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
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

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
    setToastMessage('Logout eseguito correttamente!')
    setShowToast(true)
    setTimeout(() => {
      navigate('/profile')
    }, 2000)
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
    <Container
      fluid
      className="d-flex justify-content-center font text-color p-5"
    >
      <Row className="mt-3">
        <Col xs={12}>
          {userInfo ? (
            <>
              <h1 className="mb-4 titoli-font text-center">
                {userInfo.roles?.includes('ROLE_ADMIN')
                  ? 'Bentornato Admin!'
                  : `Ciao, ${userInfo.username || userInfo.sub}!`}
              </h1>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Il tuo profilo</Card.Title>
                  <Card.Text>
                    <strong>Username:</strong>{' '}
                    {userInfo.username || userInfo.sub}
                  </Card.Text>
                  {userInfo.roles && (
                    <Card.Text>
                      <strong>Ruoli:</strong> {userInfo.roles.join(', ')}
                    </Card.Text>
                  )}

                  <div className="d-flex justify-content-around mt-4">
                    {userInfo.roles?.includes('ROLE_ADMIN') && (
                      <>
                        <Link
                          to="/admin/create-product"
                          className="btn btn-primary me-3"
                        >
                          Crea Prodotto
                        </Link>
                        <Link to="/products" className="btn btn-secondary me-3">
                          Modifica Prodotti
                        </Link>
                      </>
                    )}
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </Card.Body>
              </Card>
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
                        Registrazione
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  {isLoading && <Loading />}
                  {errorMessage && <Error message={errorMessage} />}

                  {activeTab === 'login' ? (
                    <Form onSubmit={handleLogin}>
                      <Form.Group controlId="loginUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Inserisci il tuo username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="loginPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Inserisci la tua password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="warning"
                        type="submit"
                        className="w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Accesso in corso...' : 'Accedi'}
                      </Button>
                    </Form>
                  ) : (
                    <Form onSubmit={handleRegister}>
                      <Form.Group controlId="registerUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Scegli un username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="registerPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Scegli una password (min 6 caratteri)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </Form.Group>

                      <Form.Group controlId="confirmPassword" className="mb-3">
                        <Form.Label>Conferma Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Conferma la tua password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="success"
                        type="submit"
                        className="w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registrazione in corso...' : 'Registrati'}
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          <ToastContainer position="top-end" className="p-3">
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={3000}
              autohide
            >
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile

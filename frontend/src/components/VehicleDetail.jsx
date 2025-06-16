import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap'
import Loading from '../components/Loading'
import ErrorComponent from '../components/Error'
import PaymentSimulation from '../components/PaymentSimulation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../assets/css/Vehicles.css'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    veicolo: veicoloState,
    citta = '',
    companies = [],
  } = location.state || {}

  const [vehicle, setVehicle] = useState(veicoloState || null)
  const [isLoading, setIsLoading] = useState(!veicoloState)
  const [errorMessage, setErrorMessage] = useState('')

  // Stati per prenotazione
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Stati per pagamento
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [reservationData, setReservationData] = useState(null)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    if (vehicle) return

    const fetchVehicle = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const response = await fetch(`/api/vehicles/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Veicolo non trovato')
          } else {
            throw new Error('Errore nel caricamento del veicolo')
          }
        }
        const data = await response.json()
        setVehicle(data)
      } catch (error) {
        console.error(error)
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicle()
  }, [id, vehicle])

  const calculateDays = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  const calculateTotal = (start, end, pricePerDay) => {
    const days = calculateDays(start, end)
    return (days * pricePerDay).toFixed(2)
  }

  const handlePrenota = () => {
    if (!startDate || !endDate) {
      toast.error('Seleziona entrambe le date')
      return
    }
    if (startDate > endDate) {
      toast.error('La data di inizio deve essere precedente alla data di fine')
      return
    }

    // Controlla se l'utente è autenticato
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Devi essere autenticato per prenotare')
      navigate('/profile')
      return
    }

    // Prepara i dati della prenotazione
    const reservation = {
      vehicleId: vehicle.id,
      model: vehicle.model,
      startDate,
      endDate,
      city: citta,
      pricePerDay: vehicle.pricePerDay,
    }

    setReservationData(reservation)
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = async (paymentInfo) => {
    setIsBooking(true)

    try {
      const token = localStorage.getItem('token')
      console.log('Token:', token ? 'Present' : 'Missing')
      console.log('Token length:', token?.length)

      if (!token) {
        toast.error('Token di autenticazione mancante')
        navigate('/profile')
        return
      }

      // Debug del token JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('Token payload:', payload)
        console.log(
          'User roles:',
          payload.authorities || payload.roles || payload.scope
        )
        console.log('Token expires:', new Date(payload.exp * 1000))
      } catch (error) {
        console.error('Invalid token format:', error)
        toast.error('Token non valido, effettua nuovamente il login')
        localStorage.removeItem('token')
        navigate('/profile')
        return
      }

      // Salva la prenotazione tramite API - SOLO i campi previsti dall'API
      const reservation = {
        vehicleId: reservationData.vehicleId,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        customerName: paymentInfo.name || 'Nome Cliente', // Prendi dal form di pagamento
        customerEmail: paymentInfo.email,
      }

      console.log('Sending reservation data:', reservation) // Debug

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Errore ${response.status}: ${errorText}`)
      }

      const savedReservation = await response.json()
      console.log('Saved reservation:', savedReservation)

      setShowPaymentModal(false)
      toast.success('Prenotazione confermata e pagamento completato!')

      // Reset form
      setStartDate('')
      setEndDate('')
      setReservationData(null)

      // Reindirizza al profilo dopo 2 secondi
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (error) {
      console.error('Errore nel salvare la prenotazione:', error)
      toast.error(`Errore nel salvare la prenotazione: ${error.message}`)
    } finally {
      setIsBooking(false)
    }
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
    setReservationData(null)
    toast.info('Pagamento annullato')
  }

  if (isLoading) return <Loading />
  if (errorMessage) return <ErrorComponent message={errorMessage} />
  if (!vehicle) return <p className="text-center mt-5">Veicolo non trovato</p>

  return (
    <>
      <Container className="py-5 text-color font">
        <Row className="g-4 align-items-center">
          <Col md={6}>
            <div className="d-flex justify-content-center">
              <img
                src={vehicle.image || '/default-vehicle-image.jpg'}
                alt={vehicle.model}
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
          </Col>

          <Col md={6}>
            <div className="ps-md-4">
              <h1 className="mb-3 fw-bold">{vehicle.model}</h1>
              <p className="text-muted mb-4 fs-5">
                Marca: <strong>{vehicle.brand}</strong>
                <br />
                Tipo: {vehicle.type}
                <br />
                Alimentazione: {vehicle.fuelType}
                <br />
                Posti: {vehicle.seats}
                <br />
                Anno: {vehicle.year}
                <br />
                Disponibile: {vehicle.available ? 'Sì' : 'No'}
                <br />
                {citta && (
                  <>
                    <br />
                    <strong>Città selezionata:</strong> {citta}
                  </>
                )}
              </p>
              <h3 className="mb-4">€ {vehicle.pricePerDay} / giorno</h3>

              {companies.length > 0 && (
                <p>Compagnie trovate in città: {companies.length}</p>
              )}

              <Form>
                <Form.Group controlId="startDate" className="mb-3">
                  <Form.Label>Data inizio prenotazione</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
                <Form.Group controlId="endDate" className="mb-3">
                  <Form.Label>Data fine prenotazione</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>

                {/* Mostra anteprima prezzo se le date sono selezionate */}
                {startDate && endDate && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between">
                      <span>
                        Durata: {calculateDays(startDate, endDate)} giorni
                      </span>
                      <strong>
                        Totale: €{' '}
                        {calculateTotal(
                          startDate,
                          endDate,
                          vehicle.pricePerDay
                        )}
                      </strong>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline-warning"
                  onClick={handlePrenota}
                  className="rounded-5 fw-semibold fs-5 border border-2 border-warning"
                  disabled={!startDate || !endDate || isBooking}
                >
                  {isBooking
                    ? 'Prenotazione in corso...'
                    : startDate && endDate
                    ? `Prenota ora - € ${calculateTotal(
                        startDate,
                        endDate,
                        vehicle.pricePerDay
                      )}`
                    : 'Prenota ora'}
                </Button>
              </Form>

              <Button
                variant="outline-warning"
                onClick={() => navigate(-1)}
                className="mt-3 rounded-5 text-color w-75 fw-semibold fs-5 border border-2 border-warning"
              >
                Torna indietro
              </Button>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>

      {/* Modal pagamento */}
      <Modal
        show={showPaymentModal}
        onHide={handlePaymentCancel}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-0">
          {reservationData && (
            <PaymentSimulation
              reservation={reservationData}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePaymentCancel}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default VehicleDetail

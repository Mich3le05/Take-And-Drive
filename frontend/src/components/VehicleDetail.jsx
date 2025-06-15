import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import Loading from '../components/Loading'
import ErrorComponent from '../components/Error'
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

  // Nuovi stati per prenotazione
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

  const handlePrenota = () => {
    if (!startDate || !endDate) {
      toast.error('Seleziona entrambe le date')
      return
    }
    if (startDate > endDate) {
      toast.error('La data di inizio deve essere precedente alla data di fine')
      return
    }

    const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || []

    prenotazioni.push({
      id: Date.now(),
      vehicleId: vehicle.id,
      model: vehicle.model,
      startDate,
      endDate,
      city: citta,
      pricePerDay: vehicle.pricePerDay,
    })

    localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni))
    toast.success('Prenotazione salvata con successo!')

    setStartDate('')
    setEndDate('')
  }

  if (isLoading) return <Loading />
  if (errorMessage) return <ErrorComponent message={errorMessage} />
  if (!vehicle) return <p className="text-center mt-5">Veicolo non trovato</p>

  return (
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
              <Button
                variant="outline-warning"
                onClick={handlePrenota}
                className="rounded-5 fw-semibold fs-5 border border-2 border-warning"
              >
                Prenota ora
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
  )
}

export default VehicleDetail

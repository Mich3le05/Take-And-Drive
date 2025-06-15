import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import Loading from '../components/Loading'
import ErrorComponent from '../components/Error'
import '../assets/css/Vehicles.css'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/vehicles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Veicolo non trovato')
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
  }, [id])

  if (isLoading) return <Loading />
  if (errorMessage) return <ErrorComponent message={errorMessage} />
  if (!vehicle) return <p className="text-center mt-5">Veicolo non trovato</p>

  return (
    <Container className="py-5 text-color font">
      <Row className="g-4 align-items-center">
        <Col md={6}>
          <div className="d-flex justify-content-center">
            <img
              src={vehicle.image}
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
            </p>
            <h3 className="mb-4">€ {vehicle.pricePerDay} / giorno</h3>

            <div
              className="d-flex flex-column gap-3"
              style={{ maxWidth: '250px' }}
            >
              <Button
                variant="outline-warning"
                className="rounded-5 fw-semibold fs-5 border border-2 border-warning"
                onClick={() => alert('Prenotazione in lavorazione')}
              >
                Prenota ora
              </Button>
              <Button
                variant="outline-warning"
                onClick={() => navigate(-1)}
                className="rounded-5 text-color w-75 fw-semibold fs-5 border border-2 border-warning"
              >
                Torna indietro
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default VehicleDetail

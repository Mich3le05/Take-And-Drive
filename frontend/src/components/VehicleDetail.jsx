import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import Loading from '../components/Loading'
import ErrorComponent from '../components/Error'

const VehicleDetail = () => {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/vehicles/${id}`)
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
  if (!vehicle) return <p>Veicolo non trovato</p>

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={vehicle.image} />
            <Card.Body>
              <Card.Title>{vehicle.model}</Card.Title>
              <Card.Text>
                Tipo: {vehicle.type}
                <br />
                Alimentazione: {vehicle.fuelType}
                <br />
                Prezzo giornaliero: €{vehicle.pricePerDay}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default VehicleDetail

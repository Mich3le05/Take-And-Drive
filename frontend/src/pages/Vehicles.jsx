import { useState } from 'react'
import {
  Col,
  Container,
  Form,
  Button,
  Row,
  Card,
  Spinner,
} from 'react-bootstrap'
import MapSelector from '../components/MapSelector'
import Error from '../components/Error'

const Vehicles = () => {
  const [citta, setCitta] = useState('')
  const [veicoli, setVeicoli] = useState([])
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')

  const cercaVeicoli = async (e) => {
    e.preventDefault()
    if (!citta) return setErrore('Inserisci o seleziona una città')

    setLoading(true)
    setErrore('')
    setVeicoli([])

    try {
      const response = await fetch(
        `/api/vehicles/by-city?city=${encodeURIComponent(citta)}`
      )

      if (!response.ok) {
        throw new Error('Errore nella risposta dal server')
      }
      const data = await response.json()
      setVeicoli(data)
    } catch (err) {
      console.error('Errore nel recupero dei veicoli:', err)
      setErrore(err.message || 'Errore durante il recupero dei veicoli.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4">
      <Col xs={12} md={10} lg={8} className="mx-auto">
        <h1 className="text-center mb-3">Benvenuto in Take&Drive</h1>
        <p className="text-center">
          Il tuo servizio di noleggio veicoli di fiducia.
        </p>

        <MapSelector setCitta={setCitta} />

        <Form onSubmit={cercaVeicoli} className="mb-4">
          <Form.Group>
            <Form.Label>Inserisci una città</Form.Label>
            <Form.Control
              type="text"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              placeholder="Es. Milano, Roma"
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-2 w-100" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Cerca veicoli'
            )}
          </Button>
        </Form>

        {errore && <Error message={errore} />}

        {veicoli.length > 0 && (
          <div>
            <h4>Veicoli disponibili a {citta}:</h4>
            <Row>
              {veicoli.map((veicolo) => (
                <Col key={veicolo.id} sm={12} md={6} lg={4} className="mb-3">
                  <Card>
                    <Card.Img variant="top" src={veicolo.image} />
                    <Card.Body>
                      <Card.Title>{veicolo.model}</Card.Title>
                      <Card.Text>
                        Tipo: {veicolo.type}
                        <br />
                        Alimentazione: {veicolo.fuelType}
                        <br />
                        Prezzo al giorno: €{veicolo.pricePerDay}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Col>
    </Container>
  )
}

export default Vehicles

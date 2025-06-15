import { useState, useEffect } from 'react'
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
import ErrorComponent from '../components/Error'
import { useNavigate } from 'react-router-dom'
import '../assets/css/Vehicles.css'

const Vehicles = () => {
  const [citta, setCitta] = useState('')
  const [veicoli, setVeicoli] = useState([])
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')
  const [companies, setCompanies] = useState([])
  const navigate = useNavigate()

  // Carico i dati salvati in sessionStorage all'inizio
  useEffect(() => {
    const datiSalvati = sessionStorage.getItem('vehiclesSearch')
    if (datiSalvati) {
      const { citta, veicoli, companies } = JSON.parse(datiSalvati)
      setCitta(citta)
      setVeicoli(veicoli)
      setCompanies(companies)
    }
  }, [])

  const cercaVeicoli = async (e) => {
    e.preventDefault()
    if (!citta) return setErrore('Inserisci o seleziona una città')

    setLoading(true)
    setErrore('')
    setVeicoli([])
    setCompanies([])

    try {
      const response = await fetch(
        `/api/companies/by-city?city=${encodeURIComponent(citta)}`
      )

      if (!response.ok) {
        throw new Error('Errore nella risposta dal server')
      }

      const companiesByCity = await response.json()

      const tuttiVeicoli = companiesByCity.flatMap(
        (company) => company.vehicles || []
      )

      if (tuttiVeicoli.length === 0) {
        setErrore(`Nessun veicolo trovato per la città: ${citta}`)
      } else {
        setVeicoli(tuttiVeicoli)
        setCompanies(companiesByCity)

        // Salvo in sessionStorage
        sessionStorage.setItem(
          'vehiclesSearch',
          JSON.stringify({
            citta,
            veicoli: tuttiVeicoli,
            companies: companiesByCity,
          })
        )
      }
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
        <h1 className="text-center mb-3">Cerca il veicolo adatto a te</h1>
        <h5 className="text-center mb-4">
          Seleziona una città dalla mappa o scrivi il nome
        </h5>

        <MapSelector setCitta={setCitta} />

        <Form onSubmit={cercaVeicoli} className="mb-3">
          <Form.Group>
            <Form.Label className="fw-semibold fs-4">
              Inserisci una città
            </Form.Label>
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

        {errore && <ErrorComponent message={errore} />}

        {companies.length > 0 && (
          <div>
            <h4 className="mt-4">Compagnie trovate:</h4>
            <Row>
              {companies.map((company) => (
                <Col key={company.id} sm={12} md={6} lg={4} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{company.name}</Card.Title>
                      <Card.Text>
                        Città: {company.city}
                        <br />
                        Veicoli: {company.vehicles?.length || 0}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {veicoli.length > 0 && (
          <div>
            <h4>Veicoli disponibili a {citta}:</h4>
            <Row>
              {veicoli.map((veicolo) => (
                <Col key={veicolo.id} sm={12} md={6} lg={4} className="mb-3">
                  <Card
                    onClick={() =>
                      navigate(`/vehicles/${veicolo.id}`, {
                        state: { veicolo, citta, companies },
                      })
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Img
                      variant="top"
                      src={veicolo.image || '/default-vehicle-image.jpg'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{veicolo.model}</Card.Title>
                      <Card.Text>
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

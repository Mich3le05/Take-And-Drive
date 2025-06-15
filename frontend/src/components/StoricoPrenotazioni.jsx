import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

const StoricoPrenotazioni = () => {
  const [prenotazioni, setPrenotazioni] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('prenotazioni')) || []
    setPrenotazioni(stored)
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const prenotazioniPassate = prenotazioni.filter((p) => p.endDate < today)
  const prenotazioniFuture = prenotazioni.filter((p) => p.startDate >= today)

  const eliminaPrenotazione = (id) => {
    const aggiornata = prenotazioni.filter((p) => p.id !== id)
    setPrenotazioni(aggiornata)
    localStorage.setItem('prenotazioni', JSON.stringify(aggiornata))
  }

  return (
    <Container className="py-4">
      <h2>Storico Prenotazioni</h2>

      <h4 className="mt-4">Prenotazioni Future</h4>
      {prenotazioniFuture.length === 0 && <p>Nessuna prenotazione futura.</p>}
      <Row>
        {prenotazioniFuture.map((p) => (
          <Col key={p.id} sm={12} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{p.model}</Card.Title>
                <Card.Text>
                  Città: {p.city} <br />
                  Dal: {p.startDate} <br />
                  Al: {p.endDate} <br />
                  Prezzo/giorno: €{p.pricePerDay}
                </Card.Text>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminaPrenotazione(p.id)}
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h4 className="mt-4">Prenotazioni Passate</h4>
      {prenotazioniPassate.length === 0 && <p>Nessuna prenotazione passata.</p>}
      <Row>
        {prenotazioniPassate.map((p) => (
          <Col key={p.id} sm={12} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{p.model}</Card.Title>
                <Card.Text>
                  Città: {p.city} <br />
                  Dal: {p.startDate} <br />
                  Al: {p.endDate} <br />
                  Prezzo/giorno: €{p.pricePerDay}
                </Card.Text>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminaPrenotazione(p.id)}
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default StoricoPrenotazioni

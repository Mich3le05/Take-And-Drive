import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import { Trash } from 'lucide-react'

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    setIsLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Errore nel caricamento delle prenotazioni')
      }

      const data = await response.json()
      // Ordina le prenotazioni per data di inizio (più recenti prima)
      const sortedReservations = data.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      )
      setReservations(sortedReservations)
    } catch (error) {
      console.error('Errore nel caricamento delle prenotazioni:', error)
      setError('Errore nel caricamento delle prenotazioni')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error("Errore nell'eliminazione della prenotazione")
      }

      // Rimuovi la prenotazione dalla lista locale
      setReservations((prev) => prev.filter((res) => res.id !== reservationId))
    } catch (error) {
      console.error("Errore nell'eliminazione della prenotazione:", error)
      setError("Errore nell'eliminazione della prenotazione")
    }
  }

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  const calculateTotal = (pricePerDay, startDate, endDate) => {
    const days = calculateDays(startDate, endDate)
    return (pricePerDay * days).toFixed(2)
  }

  const getReservationStatus = (startDate, endDate) => {
    const today = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (end < today) {
      return { status: 'completed', label: 'Completata', variant: 'success' }
    } else if (start <= today && end >= today) {
      return { status: 'active', label: 'In corso', variant: 'primary' }
    } else {
      return { status: 'upcoming', label: 'Prossima', variant: 'warning' }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <Alert variant="info" className="text-center">
        <h5>Caricamento prenotazioni...</h5>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <h5>Errore</h5>
        <p className="mb-0">{error}</p>
        <Button
          variant="outline-danger"
          className="mt-2"
          onClick={loadReservations}
        >
          Riprova
        </Button>
      </Alert>
    )
  }

  if (reservations.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <h5>Nessuna prenotazione trovata</h5>
        <p className="mb-0">
          Le tue prenotazioni appariranno qui una volta effettuate.
        </p>
      </Alert>
    )
  }

  return (
    <div>
      <h3 className="mb-4 text-center">
        Le tue Prenotazioni ({reservations.length})
      </h3>
      <Row className="g-3">
        {reservations.map((reservation) => {
          const statusInfo = getReservationStatus(
            reservation.startDate,
            reservation.endDate
          )
          const days = calculateDays(reservation.startDate, reservation.endDate)
          const total = calculateTotal(
            reservation.pricePerDay,
            reservation.startDate,
            reservation.endDate
          )

          return (
            <Col key={reservation.id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg={statusInfo.variant} className="p-2 px-3">
                    {statusInfo.label}
                  </Badge>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteReservation(reservation.id)}
                    title="Elimina prenotazione"
                  >
                    <Trash size={15} className="" />
                  </Button>
                </Card.Header>

                <Card.Body>
                  <Card.Title className="h5 mb-3">
                    {reservation.model}
                  </Card.Title>

                  <div className="mb-3">
                    <small className="text-muted d-block">Città</small>
                    <strong>{reservation.city || 'Non specificata'}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Periodo</small>
                    <div className="fw-semibold">
                      {formatDate(reservation.startDate)}
                    </div>
                    <div className="fw-semibold">
                      {formatDate(reservation.endDate)}
                    </div>
                    <small className="text-muted">
                      ({days} {days === 1 ? 'giorno' : 'giorni'})
                    </small>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">
                        Prezzo giornaliero
                      </small>
                      <span className="fw-bold">
                        € {reservation.pricePerDay}
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Totale</small>
                      <span className="fw-bold fs-5 text-success">
                        € {total}
                      </span>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="text-muted text-center">
                  <small>Prenotazione #{reservation.id}</small>
                </Card.Footer>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default Reservations

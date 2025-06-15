import { useState } from 'react'
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from 'react-bootstrap'
import { CreditCard, Check, X } from 'lucide-react'

const PaymentSimulation = ({ reservation, onPaymentComplete, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState('form') // 'form', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentId, setPaymentId] = useState('')

  // Form data
  const [email, setEmail] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const calculateTotal = () => {
    const start = new Date(reservation.startDate)
    const end = new Date(reservation.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1
    return reservation.pricePerDay * days * 100 // Converti in centesimi per Stripe
  }

  const formatAmount = (amountInCents) => {
    return (amountInCents / 100).toFixed(2)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentStep('processing')
    setErrorMessage('')

    try {
      // Step 1: Crea Payment Intent
      const paymentResponse = await fetch(
        'http://localhost:8080/api/payments/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.floor(calculateTotal() / 100), // Converti di nuovo in euro per il backend
            email: email,
          }),
        }
      )

      if (!paymentResponse.ok) {
        throw new Error('Errore nella creazione del pagamento')
      }

      const { clientSecret } = await paymentResponse.json()
      setClientSecret(clientSecret)

      // Simula il processo di pagamento (normalmente qui useresti Stripe Elements)
      await simulateStripePayment(clientSecret)
    } catch (error) {
      console.error('Errore nel pagamento:', error)
      setErrorMessage(error.message || 'Errore durante il pagamento')
      setPaymentStep('error')
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateStripePayment = async (clientSecret) => {
    // Simula un delay per il processo di pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simula successo/fallimento (90% successo)
    const success = Math.random() > 0.1

    if (success) {
      // Genera un ID pagamento simulato
      const simulatedPaymentId = `pi_sim_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`
      setPaymentId(simulatedPaymentId)

      // Invia email di conferma
      try {
        await fetch('http://localhost:8080/api/payments/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            paymentId: simulatedPaymentId,
          }),
        })
      } catch (emailError) {
        console.warn("Errore nell'invio dell'email:", emailError)
        // Non bloccare il flusso se l'email fallisce
      }

      setPaymentStep('success')

      // Chiama il callback di successo dopo un breve delay
      setTimeout(() => {
        onPaymentComplete &&
          onPaymentComplete({
            paymentId: simulatedPaymentId,
            amount: calculateTotal(),
            email: email,
          })
      }, 1500)
    } else {
      throw new Error('Pagamento rifiutato. Controlla i dati della carta.')
    }
  }

  const formatCardNumber = (value) => {
    // Rimuovi spazi e formatta come XXXX XXXX XXXX XXXX
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    setExpiryDate(value)
  }

  if (paymentStep === 'processing') {
    return (
      <Card className="text-center p-4">
        <Card.Body>
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Elaborazione pagamento...</h4>
          <p className="text-muted">Non chiudere questa finestra</p>
        </Card.Body>
      </Card>
    )
  }

  if (paymentStep === 'success') {
    return (
      <Card className="text-center p-4 border-success">
        <Card.Body>
          <div className="text-success mb-3">
            <Check size={64} />
          </div>
          <h4 className="text-success">Pagamento completato!</h4>
          <p className="mb-3">
            La tua prenotazione è stata confermata.
            <br />
            ID Pagamento: <code>{paymentId}</code>
          </p>
          <Badge bg="success" className="mb-3">
            € {formatAmount(calculateTotal())} pagati con successo
          </Badge>
          <p className="text-muted small">
            Riceverai una email di conferma all'indirizzo: {email}
          </p>
        </Card.Body>
      </Card>
    )
  }

  if (paymentStep === 'error') {
    return (
      <Card className="text-center p-4 border-danger">
        <Card.Body>
          <div className="text-danger mb-3">
            <X size={64} />
          </div>
          <h4 className="text-danger">Pagamento fallito</h4>
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-primary"
              onClick={() => {
                setPaymentStep('form')
                setErrorMessage('')
              }}
            >
              Riprova
            </Button>
            <Button variant="outline-secondary" onClick={onCancel}>
              Annulla
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <CreditCard size={24} className="me-2" />
          <h5 className="mb-0">Completa il pagamento</h5>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Riepilogo prenotazione */}
        <div className="mb-4 p-3 bg-light rounded">
          <h6>Riepilogo prenotazione</h6>
          <Row>
            <Col>
              <strong>{reservation.model}</strong>
              <br />
              <small className="text-muted">
                {new Date(reservation.startDate).toLocaleDateString('it-IT')} -{' '}
                {new Date(reservation.endDate).toLocaleDateString('it-IT')}
              </small>
            </Col>
            <Col xs="auto">
              <div className="text-end">
                <div className="fs-4 fw-bold text-success">
                  € {formatAmount(calculateTotal())}
                </div>
                <small className="text-muted">
                  € {reservation.pricePerDay}/giorno
                </small>
              </div>
            </Col>
          </Row>
        </div>

        <Form onSubmit={handlePayment}>
          <Form.Group className="mb-3">
            <Form.Label>Email per conferma</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@esempio.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome titolare carta</Form.Label>
            <Form.Control
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Mario Rossi"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Numero carta</Form.Label>
            <Form.Control
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
            <Form.Text className="text-muted">
              💡 Simulazione: usa qualsiasi numero per testare
            </Form.Text>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Scadenza</Form.Label>
                <Form.Control
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  maxLength="5"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="text"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))
                  }
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Alert variant="info" className="mb-3">
            <small>
              🔒 <strong>Modalità simulazione:</strong> Questo è un pagamento di
              test. Nessuna carta verrà effettivamente addebitata.
            </small>
          </Alert>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="success"
              disabled={isProcessing}
              className="flex-grow-1"
            >
              {isProcessing ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Elaborazione...
                </>
              ) : (
                `Paga € ${formatAmount(calculateTotal())}`
              )}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Annulla
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default PaymentSimulation

package com.takeanddrive.takeanddrive.stripe;

import com.stripe.exception.StripeException;
import com.takeanddrive.takeanddrive.mail.EmailRequest;
import com.takeanddrive.takeanddrive.mail.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final StripeService stripeService;
    private final EmailService emailService;

    public PaymentController(StripeService stripeService, EmailService emailService) {
        this.stripeService = stripeService;
        this.emailService = emailService;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentRequest request) throws StripeException {
        // Creazione del PaymentIntent
        String clientSecret = stripeService.createPaymentIntent(request.getAmount(), "eur");

        // Restituisci solo il clientSecret
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", clientSecret);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendPaymentEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getEmail(), "Conferma Pagamento",
                    "Grazie per il tuo acquisto! Il pagamento è stato ricevuto con successo. ID: " + request.getPaymentId());
            return ResponseEntity.ok("Email inviata con successo");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nell'invio dell'email");
        }
    }
}

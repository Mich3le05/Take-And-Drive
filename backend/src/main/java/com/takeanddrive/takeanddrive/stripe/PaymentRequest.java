package com.takeanddrive.takeanddrive.stripe;

public class PaymentRequest {
    private Long amount;
    private String email;

    public PaymentRequest() {}

    public PaymentRequest(Long amount, String email) {
        this.amount = amount;
        this.email = email;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

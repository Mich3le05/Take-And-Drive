package com.takeanddrive.takeanddrive.reservations;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long vehicleId;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalPrice;
}

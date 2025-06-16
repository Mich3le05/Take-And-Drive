package com.takeanddrive.takeanddrive.reservations;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse create(@RequestBody @Valid ReservationRequest request) {
        return reservationService.createReservation(request);
    }

    @GetMapping("/past")
    public List<ReservationResponse> getPastReservations() {
        return reservationService.getPastReservations();
    }

    @GetMapping("/future")
    public List<ReservationResponse> getFutureReservations() {
        return reservationService.getFutureReservations();
    }

    @PutMapping("/{id}")
    public ReservationResponse updateReservation(@PathVariable Long id, @RequestBody @Valid ReservationRequest request) {
        return reservationService.updateReservation(id, request);
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/mine")
    public List<ReservationResponse> getSellerReservations() {
        return reservationService.getReservationsBySeller();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}
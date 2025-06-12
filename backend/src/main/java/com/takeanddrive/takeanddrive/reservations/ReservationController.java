package com.takeanddrive.takeanddrive.reservations;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ReservationResponse updateReservation(@PathVariable Long id, @RequestBody @Valid ReservationRequest request) {
        return reservationService.updateReservation(id, request);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('SELLER')")
    public List<ReservationResponse> getSellerReservations() {
        return reservationService.getReservationsBySeller();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}

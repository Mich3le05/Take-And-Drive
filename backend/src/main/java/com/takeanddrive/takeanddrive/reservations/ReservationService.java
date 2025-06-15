package com.takeanddrive.takeanddrive.reservations;

import com.takeanddrive.takeanddrive.vehicles.Vehicle;
import com.takeanddrive.takeanddrive.vehicles.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final VehicleRepository vehicleRepository;

    public ReservationResponse createReservation(ReservationRequest request) {
        // Validazione delle date
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        if (!isVehicleAvailable(vehicle.getId(), request.getStartDate(), request.getEndDate())) {
            throw new IllegalArgumentException("Vehicle is not available for the selected period");
        }

        Reservation reservation = new Reservation();
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setVehicle(vehicle);
        reservation.setCustomerName(request.getCustomerName());
        reservation.setCustomerEmail(request.getCustomerEmail());

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal totalPrice = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));
        reservation.setTotalPrice(totalPrice);

        reservationRepository.save(reservation);

        return mapToResponse(reservation);
    }

    private boolean isVehicleAvailable(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(vehicleId, startDate, endDate);
        return overlapping.isEmpty();
    }

    public List<ReservationResponse> getPastReservations() {
        LocalDate today = LocalDate.now();
        String email = getLoggedUserEmail();
        return reservationRepository.findByEndDateBeforeAndCustomerEmail(today, email).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservationResponse> getFutureReservations() {
        LocalDate today = LocalDate.now();
        String email = getLoggedUserEmail();
        return reservationRepository.findByEndDateGreaterThanEqualAndCustomerEmail(today, email).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservationResponse> getReservationsBySeller() {
        String sellerEmail = getLoggedUserEmail();

        return reservationRepository.findAll().stream()
                .filter(r -> r.getVehicle().getCreatedBy() != null &&
                        r.getVehicle().getCreatedBy().equalsIgnoreCase(sellerEmail))
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));
        reservationRepository.delete(reservation);
    }

    private String getLoggedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }
        return authentication.getName();
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getStartDate(),
                reservation.getEndDate(),
                reservation.getVehicle().getId(),
                reservation.getCustomerName(),
                reservation.getCustomerEmail(),
                reservation.getTotalPrice()
        );
    }

    public ReservationResponse updateReservation(Long id, ReservationRequest request) {
        // Validazione delle date
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        // Controlla disponibilità escludendo la prenotazione corrente
        if (!isVehicleAvailableForUpdate(id, request.getVehicleId(), request.getStartDate(), request.getEndDate())) {
            throw new IllegalArgumentException("Vehicle not available in selected period");
        }

        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setCustomerName(request.getCustomerName());
        reservation.setCustomerEmail(request.getCustomerEmail());
        reservation.setVehicle(vehicle);

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal totalPrice = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));
        reservation.setTotalPrice(totalPrice);

        reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    private boolean isVehicleAvailableForUpdate(Long reservationId, Long vehicleId, LocalDate startDate, LocalDate endDate) {
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(vehicleId, startDate, endDate);
        // Esclude la prenotazione corrente dalla verifica
        return overlapping.stream().noneMatch(r -> !r.getId().equals(reservationId));
    }
}
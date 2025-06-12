package com.takeanddrive.takeanddrive.reservations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.vehicle.id = :vehicleId AND " +
            "(:startDate BETWEEN r.startDate AND r.endDate OR " +
            ":endDate BETWEEN r.startDate AND r.endDate OR " +
            "r.startDate BETWEEN :startDate AND :endDate)")
    List<Reservation> findOverlappingReservations(Long vehicleId, LocalDate startDate, LocalDate endDate);

    List<Reservation> findByEndDateBeforeAndCustomerEmail(LocalDate date, String email);

    List<Reservation> findByEndDateGreaterThanEqualAndCustomerEmail(LocalDate date, String email);
}

package com.takeanddrive.takeanddrive.vehicles;

import com.takeanddrive.takeanddrive.response.PagedResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setSeats(request.getSeats());
        vehicle.setPricePerDay(request.getPricePerDay());
        vehicle.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        vehicle.setType(VehicleType.valueOf(request.getType().toUpperCase()));
        vehicle.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
        vehicle.setYear(request.getYear());
        vehicle.setImage(request.getImage());

        // Recupera l'email dell'utente loggato
        String loggedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        vehicle.setCreatedBy(loggedUserEmail);

        vehicleRepository.save(vehicle);
        return mapToResponse(vehicle);
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setSeats(request.getSeats());
        vehicle.setPricePerDay(request.getPricePerDay());
        vehicle.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        vehicle.setType(VehicleType.valueOf(request.getType().toUpperCase()));
        vehicle.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
        vehicle.setYear(request.getYear());
        vehicle.setImage(request.getImage());

        vehicleRepository.save(vehicle);
        return mapToResponse(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }

    public List<VehicleResponse> findAll() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> findByType(String type) {
        return vehicleRepository.findAll().stream()
                .filter(v -> v.getType().toString().equalsIgnoreCase(type))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<VehicleResponse> findAllPaged(int page, int size) {
        Page<Vehicle> vehiclesPage = vehicleRepository.findAll(PageRequest.of(page, size));
        return vehiclesPage.map(this::mapToResponse);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getSeats(),
                vehicle.getPricePerDay(),
                vehicle.isAvailable(),
                vehicle.getType().toString(),
                vehicle.getFuelType().toString(),
                vehicle.getCreatedBy(),
                vehicle.getYear(),
                vehicle.getImage()
        );
    }
    public List<VehicleResponse> findByCity(String city) {
        List<Vehicle> vehicles = vehicleRepository.findByCompany_CityIgnoreCase(city);
        return vehicles.stream()
                .map(this::mapToResponse)
                .toList();
    }

}

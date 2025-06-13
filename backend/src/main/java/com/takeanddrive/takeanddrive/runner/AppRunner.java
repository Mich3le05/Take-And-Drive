package com.takeanddrive.takeanddrive.runner;

import com.takeanddrive.takeanddrive.company.Company;
import com.takeanddrive.takeanddrive.company.CompanyRepository;
import com.takeanddrive.takeanddrive.vehicles.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AppRunner implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) {

        if (companyRepository.count() == 0) {
            Company castrorealeCompany = new Company();
            castrorealeCompany.setName("Castroreale Mobility");
            castrorealeCompany.setCity("Castroreale");

            companyRepository.save(castrorealeCompany);

            List<Vehicle> veicoli = List.of(
                    createVehicle("Fiat", "Panda", 4, new BigDecimal("30.00"), true, VehicleType.CAR, FuelType.GASOLINE, 2018, castrorealeCompany),
                    createVehicle("Ford", "Fiesta", 5, new BigDecimal("35.00"), true, VehicleType.CAR, FuelType.DIESEL, 2019, castrorealeCompany),
                    createVehicle("Piaggio", "Liberty", 2, new BigDecimal("20.00"), true, VehicleType.SCOOTER, FuelType.GASOLINE, 2020, castrorealeCompany),
                    createVehicle("Renault", "Clio", 5, new BigDecimal("33.00"), true, VehicleType.CAR, FuelType.HYBRID, 2021, castrorealeCompany),
                    createVehicle("Opel", "Corsa", 5, new BigDecimal("32.00"), true, VehicleType.CAR, FuelType.DIESEL, 2022, castrorealeCompany),
                    createVehicle("Kymco", "Agility", 2, new BigDecimal("22.00"), true, VehicleType.SCOOTER, FuelType.GASOLINE, 2021, castrorealeCompany)
            );

            vehicleRepository.saveAll(veicoli);

            System.out.println("Dati di esempio inseriti correttamente.");
        }
    }

    private Vehicle createVehicle(String brand, String model, int seats, BigDecimal pricePerDay, boolean available,
                                  VehicleType type, FuelType fuelType, int year, Company company) {
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setSeats(seats);
        vehicle.setPricePerDay(pricePerDay);
        vehicle.setAvailable(available);
        vehicle.setType(type);
        vehicle.setFuelType(fuelType);
        vehicle.setYear(year);
        vehicle.setCreatedBy("Seeder");
        vehicle.setImage(""); // puoi aggiungere un URL se vuoi
        vehicle.setCompany(company);
        return vehicle;
    }
}

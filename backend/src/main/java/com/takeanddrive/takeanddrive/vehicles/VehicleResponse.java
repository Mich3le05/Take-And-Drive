package com.takeanddrive.takeanddrive.vehicles;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String brand;
    private String model;
    private Integer seats;
    private BigDecimal pricePerDay;
    private boolean available;
    private String type;
    private String fuelType;
    private String createdBy;
    private Integer year;
    private String image;
}

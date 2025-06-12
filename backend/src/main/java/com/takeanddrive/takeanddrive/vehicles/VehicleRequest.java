package com.takeanddrive.takeanddrive.vehicles;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleRequest {

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotNull
    private Integer seats;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal pricePerDay;

    private Boolean available;

    @NotBlank
    private String type;

    @NotBlank
    private String fuelType;

    @NotNull
    private Integer year;

    @NotBlank
    private String image;
}

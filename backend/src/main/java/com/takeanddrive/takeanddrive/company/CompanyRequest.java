package com.takeanddrive.takeanddrive.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Il nome della compagnia è obbligatorio")
    private String name;

    @NotBlank(message = "La città è obbligatoria")
    private String city;

}

package com.takeanddrive.takeanddrive.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @NotBlank(message = "Il nome non può essere vuoto")
    private String name;

    @NotBlank(message = "Il cognome non può essere vuoto")
    private String surname;

    @NotBlank(message = "Lo username non può essere vuoto")
    private String username;

    @Email(message = "L'email deve essere valida")
    @NotBlank(message = "L'email non può essere vuota")
    private String email;

    @NotBlank(message = "La password non può essere vuota")
    @Size(min = 6, message = "La password deve essere lunga almeno 6 caratteri")
    private String password;

    @NotBlank(message = "Il ruolo non può essere vuoto")
    private String role;
}
package com.takeanddrive.takeanddrive.users;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private UserRole role;
}

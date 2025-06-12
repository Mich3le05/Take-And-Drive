package com.takeanddrive.takeanddrive.vehicles;

import com.takeanddrive.takeanddrive.response.CreateResponse;
import com.takeanddrive.takeanddrive.response.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN') or hasRole('SELLER')")
    public CreateResponse create(@RequestBody @Valid VehicleRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return new CreateResponse(response.getId());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SELLER')")
    public VehicleResponse update(@PathVariable Long id, @RequestBody @Valid VehicleRequest request) {
        return vehicleService.updateVehicle(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }

    @GetMapping
    public List<VehicleResponse> getAll() {
        return vehicleService.findAll();
    }

    @GetMapping("/paged")
    public PagedResponse<VehicleResponse> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<VehicleResponse> pageResult = vehicleService.findAllPaged(page, size);
        return new PagedResponse<>(
                pageResult.getContent(),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalPages(),
                pageResult.getTotalElements()
        );
    }


    @GetMapping("/type/{type}")
    public List<VehicleResponse> getByType(@PathVariable String type) {
        return vehicleService.findByType(type);
    }
}

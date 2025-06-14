package com.takeanddrive.takeanddrive.company;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    public Optional<Company> findById(Long id) {
        return companyRepository.findById(id);
    }

    public Company save(Company company) {
        return companyRepository.save(company);
    }

    public void deleteById(Long id) {
        companyRepository.deleteById(id);
    }

    public List<Company> findByCityWithVehicles(String city) {
        return companyRepository.findAllByCityIgnoreCase(city);
    }

    public Optional<Company> update(Long id, CompanyRequest request) {
        return companyRepository.findById(id).map(existing -> {
            existing.setName(request.getName());
            existing.setCity(request.getCity());
            return companyRepository.save(existing);
        });
    }
}

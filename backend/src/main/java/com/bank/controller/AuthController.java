package com.bank.controller;

import com.bank.model.Administrator;
import com.bank.repository.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdministratorRepository administratorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Administrator admin) {
        Administrator found = administratorRepository.findById(admin.getUsername()).orElse(null);
        if (found != null && found.getPassword().equals(admin.getPassword())) {
            return ResponseEntity.ok(found);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/admins")
    public List<Administrator> getAllAdmins() {
        return administratorRepository.findAll();
    }

    @PostMapping("/admins")
    public Administrator addAdmin(@RequestBody Administrator admin) {
        return administratorRepository.save(admin);
    }

    @DeleteMapping("/admins/{username}")
    public void deleteAdmin(@PathVariable String username) {
        administratorRepository.deleteById(username);
    }
}

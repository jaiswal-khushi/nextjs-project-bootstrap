package com.bank.repository;

import com.bank.model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministratorRepository extends JpaRepository<Administrator, String> {
}

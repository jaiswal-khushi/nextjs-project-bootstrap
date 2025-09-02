package com.bank.controller;

import com.bank.model.Account;
import com.bank.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountNumber) {
        Optional<Account> account = accountRepository.findByAccountNumber(accountNumber);
        return account.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> transfer(@RequestParam String sourceAccountNumber,
                                           @RequestParam String destinationAccountNumber,
                                           @RequestParam Double amount) {
        if (amount <= 0) {
            return ResponseEntity.badRequest().body("Invalid transfer amount");
        }

        Optional<Account> sourceOpt = accountRepository.findByAccountNumber(sourceAccountNumber);
        Optional<Account> destOpt = accountRepository.findByAccountNumber(destinationAccountNumber);

        if (sourceOpt.isEmpty() || destOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Account not found");
        }

        Account source = sourceOpt.get();
        Account dest = destOpt.get();

        if (source.getBalance() < amount) {
            return ResponseEntity.badRequest().body("Insufficient balance");
        }

        source.setBalance(source.getBalance() - amount);
        dest.setBalance(dest.getBalance() + amount);

        accountRepository.save(source);
        accountRepository.save(dest);

        return ResponseEntity.ok("Transfer successful");
    }
}

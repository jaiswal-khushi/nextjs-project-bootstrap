package com.bank.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "administrators")
public class Administrator {
    @Id
    private String username;
    private String name;
    private String password;

    public Administrator() {}

    public Administrator(String username, String name, String password) {
        this.username = username;
        this.name = name;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

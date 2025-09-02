#!/bin/bash

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit of self-checkout Flutter app"

# Set remote origin - replace with your GitHub repo URL
git remote add origin https://github.com/your-username/self-checkout-app.git

# Push to main branch
git branch -M main
git push -u origin main

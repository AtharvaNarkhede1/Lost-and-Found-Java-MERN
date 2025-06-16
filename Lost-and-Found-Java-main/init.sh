#!/bin/bash

echo "📁 Creating folder structure..."

# Create main project structure
mkdir -p LostAndFoundApp/src/main/java/app
mkdir -p LostAndFoundApp/src/main/java/controller
mkdir -p LostAndFoundApp/src/main/java/dao
mkdir -p LostAndFoundApp/src/main/java/model
mkdir -p LostAndFoundApp/src/main/java/view
mkdir -p LostAndFoundApp/resources
mkdir -p LostAndFoundApp/lib

echo "📄 Creating empty Java class files..."

# App entry point
touch LostAndFoundApp/src/main/java/app/Main.java

# Controllers
touch LostAndFoundApp/src/main/java/controller/AdminController.java
touch LostAndFoundApp/src/main/java/controller/PostController.java
touch LostAndFoundApp/src/main/java/controller/UserController.java

# DAOs
touch LostAndFoundApp/src/main/java/dao/DBConnection.java
touch LostAndFoundApp/src/main/java/dao/PostDAO.java
touch LostAndFoundApp/src/main/java/dao/UserDAO.java
touch LostAndFoundApp/src/main/java/dao/ClaimDAO.java

# Models
touch LostAndFoundApp/src/main/java/model/Post.java
touch LostAndFoundApp/src/main/java/model/User.java
touch LostAndFoundApp/src/main/java/model/Claim.java

# Views
touch LostAndFoundApp/src/main/java/view/AdminView.java
touch LostAndFoundApp/src/main/java/view/LoginView.java
touch LostAndFoundApp/src/main/java/view/PostView.java
touch LostAndFoundApp/src/main/java/view/MainView.java

# Resources
touch LostAndFoundApp/resources/db_script.sql

echo "✅ Project structure created."

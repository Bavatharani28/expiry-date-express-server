# Coding Instructions for AI Agents

## Project Overview

This inventory application manages expiry dates and helps users track items nearing expiration.
This repository contains REST APIs which support operations like AuthN/AuthZ, CRUD operations, etc., related to expiry date management.

## Tech Stack & Environment

- **Node.js:** v24.0.1
- **Express:** v5
- **Database:** MongoDB

## Project Structure

src/                    # Source code
src/config/             # Configuration files
src/controllers/        # Controller functions
src/models/             # Mongoose models
src/routes/             # Route definitions
src/services/           # Business logic
src/utils/              # Utility functions
src/dao/                # Database interactions
server.js               # Entry point

## Architecture Patterns

- Follow a strict **Controller-Service-Repository** pattern.
- Routes must only map to controllers.
- Always generate Swagger models for every newly added API.

## Coding Style Examples

### Controller

Use async handlers and keep controllers thin.

### Service

Place all business logic in services.

### DAO / Repository

All database queries must be isolated inside the DAO layer.
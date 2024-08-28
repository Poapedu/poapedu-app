# poapedu Server

This is the server-side application for poapedu, a platform for managing learner profiles, skills, and NFTs. It's built with Node.js and Express, and uses MySQL for data storage.

## Table of Contents

- [poapedu Server](#poapedu-server)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [API Endpoints](#api-endpoints)
    - [User Management](#user-management)
    - [Skills Management](#skills-management)
    - [Web Scraping](#web-scraping)
    - [NFT Management](#nft-management)
    - [Miscellaneous](#miscellaneous)
  - [Database Schema](#database-schema)
  - [External Services](#external-services)
  - [Security](#security)
  - [Error Handling](#error-handling)

## Features

- User profile management
- Skills tracking and management
- Web scraping for certificate validation
- NFT metadata management
- Integration with Moralis for NFT data
- Newsletter subscription
- Social media profile management

## Prerequisites

- Node.js
- MySQL
- Moralis API key
- Pinata API key and secret (for IPFS)
- Supabase account (for authentication)

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up your MySQL database
4. Configure your environment variables (see [Configuration](#configuration))
5. Run `npm start` to start the server

## Configuration

Create a `.env` file in the root directory with the following variables:

`PROD_MYSQL_HOST=your_mysql_host
PROD_MYSQL_USER=your_mysql_user
PROD_MYSQL_PASS=your_mysql_password
PROD_MYSQL_DB=your_mysql_database
MORALIS_API_KEY=your_moralis_api_key
POAPEDU_PINATA_API_KEY=your_pinata_api_key
POAPEDU_PINATA_SECRET_API_KEY=your_pinata_secret_key
SUPABASE_WEBHOOK_SECRET=your_supabase_webhook_secret
PORT=3000`

## API Endpoints

### User Management
- POST `/api/save-profile`: Save or update user profile
- POST `/api/save-socials`: Save or update user's social media links
- POST `/api/update-profile-photo`: Update user's profile photo
- POST `/api/update-profile-banner`: Update user's profile banner
- POST `/api/learners/check-email`: Check if a user exists by email
- POST `/api/learners`: Create a new user
- GET `/api/user`: Get user details by email

### Skills Management
- POST `/api/save-skills`: Save skills for a user
- POST `/skills-webhook`: Webhook for processing skills data
- GET `/api/skills/:learner_id`: Get skills for a specific learner

### Web Scraping
- GET `/scrape`: Scrape certificate data from various platforms

### NFT Management
- POST `/upload-metadata`: Upload NFT metadata to IPFS
- POST `/api/getUserNFTs`: Get NFTs owned by a user

### Miscellaneous
- POST `/subscribe`: Subscribe to newsletter
- POST `/supabase-webhook`: Webhook for Supabase events

## Database Schema

The application uses several MySQL tables:

- `Learners`: Stores user profile information
- `Skills`: Stores available skills
- `LearnerSkills`: Maps skills to learners
- `NewsletterSubscribers`: Stores newsletter subscriptions

## External Services

- Moralis: Used for fetching NFT data
- Pinata: Used for uploading metadata to IPFS
- Supabase: Used for user authentication

## Security

- CORS is enabled
- Supabase webhook is authenticated using a secret key
- Database passwords and API keys are stored as environment variables

## Error Handling

The application includes error handling for database operations and API requests. Errors are logged to the console and appropriate error responses are sent to the client.
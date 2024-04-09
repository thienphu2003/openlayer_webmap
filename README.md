# Express EJS Application

This is a simple Express application that uses EJS as its view engine.

## Features

- Renders the "index" view when a GET request is made to the root URL ("/").

- URL entry point : localhost://3002

## Setup

1. Install dependencies: `npm install`
2. Start the server: `npm start`

## Usage

- Make a GET request to the root URL ("/") to view the "index" page.

Database config : (Currently using localhost)  -> Can see in server/config/config.json (PostgresSQL)
You can replace localhost by you computer IP address when creating the database in Postgres 

## Database Configuration

The database configuration for this application is located in the `config/config.json` file in the root directory. It contains configurations for development, test, and production environments.

Here's what the configuration looks like:

```json
{
  "development": {
    "username": "postgres",
    "password": "270803",
    "database": "cloud_computing_final_project",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}




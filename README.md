# Kanji Loader Makefile

This repository contains a Makefile for setting up and managing the Kanji Loader application. The Makefile automates several tasks, including the installation of Python and npm dependencies, running Docker Compose, executing Prisma migrations, and running the Kanji loader script. This helps streamline the development and deployment processes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Makefile Targets](#makefile-targets)
  - [Install Python Requirements](#install-python-requirements)
  - [Install npm Packages](#install-npm-packages)
  - [Run Docker Compose](#run-docker-compose)
  - [Run Prisma Migrations](#run-prisma-migrations)
  - [Run Kanji Loader](#run-kanji-loader)
  - [Start Backend](#start-backend)
  - [Full Setup and Execution](#full-setup-and-execution)
  - [Clean Up](#clean-up)
  - [Force Clean](#force-clean)
- [Logging](#logging)

## Prerequisites

Before using this Makefile, ensure you have the following installed on your system:

- **Docker**: A platform to develop, ship, and run applications in containers. [Get started with Docker](https://www.docker.com/get-started).
- **Docker Compose**: A tool for defining and running multi-container Docker applications. [Installation guide](https://docs.docker.com/compose/install/).
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. [Download Node.js](https://nodejs.org/).
- **Python 3**: The programming language used for the Kanji loader script. [Download Python 3](https://www.python.org/downloads/).
- **Pip**: A package manager for Python that allows you to install and manage additional libraries and dependencies. It typically comes with Python installations.

## Environment Variables

You need to create a `.env` file in the root directory with the following placeholders and your respective values. This file is crucial for connecting to your database and managing authentication:

```bash
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DATABASE_NAME>?schema=public"
JWT_SECRET="<YOUR_JWT_SECRET>"
ROUNDS_OF_HASHING=<NUMBER_OF_HASHING_ROUNDS>
```

- DATABASE_URL: The connection string for your PostgreSQL database. Adjust the username, password, and database name accordingly.

* JWT_SECRET: A secret key used for signing JSON Web Tokens (JWT) for secure authentication.

```bash
openssl rand -base64 32
```

- ROUNDS_OF_HASHING: The number of hashing rounds for password hashing, which affects the security of stored passwords. (ex. 10)

## Makefile Targets

The Makefile provides several targets that you can run to manage your application easily. Each target corresponds to a specific task:

# Install Python Requirements

Install Python dependencies defined in requirements.txt. This is necessary to ensure that the Kanji loader script has all the required libraries.

```bash
make install-python-requirements
```

# Install npm Packages

Install npm packages defined in package.json. This step prepares the Node.js environment for the backend server.

```bash
make install-npm
```

# Run Docker Compose

Start the Docker containers defined in docker-compose.yml. This command sets up the necessary services for your application, such as databases and other dependencies.

```bash
make up
```

# Run Prisma Migrations

Execute Prisma migrations to set up your database schema. This step is crucial for applying any changes to your database structure.

```bash
make prisma-migrate
```

# Run Kanji Loader

Execute the Kanji loader script. This script is responsible for loading Kanji data into your database.

```bash
make run-kanji-loader
```

# Start Backend

Start the NestJS backend server, which serves your application’s API and handles incoming requests.

```bash
make start
```

# Full Setup and Execution

Run all steps (installing dependencies, starting Docker, running migrations, and executing the Kanji loader) in one command. This command simplifies the setup process for development.

```bash
make all
```

# Clean Up

Stop running Docker containers and clean up the environment. This command helps to maintain a tidy workspace by stopping services and removing unnecessary files.

```bash
make clean
```

# Force Clean

Forcefully remove Docker containers, networks, volumes, and images. Use this command to clear everything related to Docker in case of errors or for a complete reset.

```bash
make fclean
```

# Logging

During execution, any errors encountered will be logged into two separate files for easier debugging:

- log_error.log: Contains errors from the general tasks executed by the Makefile.

* log_nest_error.log: Contains errors specifically related to the NestJS backend.
  Review these logs if you encounter issues during execution.

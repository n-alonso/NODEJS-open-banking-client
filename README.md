# Open Banking Client (WORK IN PROGRESS)
The goal of this project is to build a payment service using Open Banking APIs (True Layer).  
My intention is build a server making it as 'production-ready' as I can and trying to build the core components on my own isntead of using existing solutions.  

## TL;DR
I wanted to practice building my own Core Module which includes an Inversion of Control (IoC) container with register/resolve pattern and an Application class with register/bootstrap pattern to handle application lyfecycle.
The application register uses the `glob` package to scan the filesystem for components and middlewares to dynamically load them.
I use a Route > Service > Repository architechture for modules, which in turn connects to dynamic DataSources to allow for future changes (Knex.js).
This architecture should allow anyone to add new middlewares and new modules with ease with minimal to no configuration to the applciation itself.

**Disclaimer:** Wanted to make a project that showcases my knowledge and skills, so some of the features are *forced* into the project and might not make sense in a practical scenario, yet they were added for the mere purpose of practicing them.

## Table of Contents
- [Tech-Stack](#this-project-utilizes-the-following-tech-stack)
- [Security](#security)
- DevOps
    - [Infrastructure](#infrastructure)
    - [Server](#server)
    - [CI/CD](#cicd)
- [Installation](#installation)
- [Usage](#usage)

## This project utilizes the following Tech-Stack:
- Runtime:
  - Node.js
- Implementation:
  - Koa.js
  - TypeScript
  - Knex.js
- Infrastructure:
  - Docker
  - Digital Ocean
  - Github Actions
  - NGINX
- TBD | Testing:
  - TBD | Jest
- TBD | Documentation:
  - TBD | Typedoc for automatically generated OAS
- Other:
  - FS Scanning: Glob
  - Logger: Winston
  - Styling: Eslint, Prettier
  - Crypto: Node Crypto
 
## Security:
I've tried to add most of the common security features that you would typically add to a production-ready application:
- Middlewares - Helmet, Cors and RateLimit are initialised with (example) defaults (except Helmet).
- Passport.js - Google OAuth20.
- JWT - Sets a jwt cookie once logged in.
- RBAC - Roles ('user' & 'admin') are guarded with policies.
- Policies - Implemented per route/endpoint (Ie. isAuthenticated, isAdmin, isSelf).
- Encryption at rest - Node Crypto is used to encrypt/decrypt all user details.
- Encryption in transit - Digital Ocean provides SSL certificates by default.

## Infrastructure:
- Containers: Dockerfile and Docker Compose files are available in this repository and published to Docker Hub.
- Cloud: This project is hosted in a Digital Ocean Droplet VM.

## Server: 
NGINX instance is used as a proxy to direct the traffic to the project.

## CI/CD:
- GitHub Actions: On Pull Requests to `main` it will build and deploy the application:
  - Build: Sets up the environment and then lints, builds and uploads the build as an artifact.
  - Deploy: Downloads the build artifact, installs the ssh key, cleans the existing project version in Digital Ocean, deploys the new version and verifies that the server is up and running.
- Gitlab CI: I created a different pipeline in Gitlab for experimentation purposes:
  - Build: Builds the Docker image and stores it in Gitlab's registry.
  - Verify: Pulls the image from the registry, starts it and verifies that it works as intended.

## Installation
This project presumes you have Node with v18 and Yarn installed and available.
1. Clone the project `git clone <url>`.
2. Navigate into the directory `cd <path>`.
3. Install all the dependencies `yarn install`.
4. Create a `.env` file with all the necessary variables (check `example.env`).
5. Run `knex migrate:latest` to initialise the database.

Available Scripts:
 - `yarn build`: Compile the TypeScript code.
 - `yarn start`: Start the project from the compiled JavaScript (production).
 - `yarn start:dev`: Start the project from the TypeScript files (development).
 - `yarn lint`: Lint the project.
 - `yarn user:elevate <user_id>`: Elevate an existing user's permissions (update role to 'admin').

## Usage
1. Start the server.
2. Create your first user by logging in with the `/auth/google` endpoint.
3. Stop the server.
4. Elevate your first user to 'admin' with `yarn user:elevate <user_id>` with the `id` returned from step 2.
5. Re-start the server.
6. Now you should be able to fetch users at the `/users` endpoint.
7. Alternatively, any non-admin (role 'user') user should be able to fetch itself at the `/users/:id` endpoint, granted that it is authenticated correctly.

# Open Banking Sandbox (WORK IN PROGRESS)
The goal of this project is to build a payment service using Open Banking APIs.  
My intention is build a server using an Object-Oriented Programming (OOP) approach, adhering to clean code best practices and making it as 'production-ready' as I can.  

## TL;DR
I wanted to practice building my own Core Module which includes an Inversion of Control (IoC) container with register/resolve pattern and an Application class with register/bootstrap pattern to handle application lyfecycle.
The application register uses the `glob` package to scan the filesystem for components and middlewares to loads them automatically.
I used a Route > Service > Repository architechture, which in turn connects to dynamic DataSources to allow for future changes (Knex with Postgres initially).
This architecture should allow anyone to add new middlewares and new modules with ease with minimal to no configuration to the applciation itself.

Also wanted to make a project that showcases my knowledge and skills, so some of the features are 'forced' into the project and might not make sense in a practical scenario, yet they were added for the mere purpose of proving my ability to do them.

## Table of Contents
- [Tech-Stack](#this-project-utilizes-the-following-tech-stack)
- For Recruiters
    - [Security](#security)
  - DevOps
    - [Infraestructure](#infraestructure)
  - Backend
    - [SOLID Principles](#i-strived-to-adhere-to-solid-principles)
    - [Coding Patterns Utilised](#coding-patterns-utilised)
    - [Data Structures](#data-structures)
    - [Algorithms](#algorithms)
- [Installation](#installation)
- [Usage](#usage)

## This project utilizes the following Tech-Stack:
- Runtime:
  - Node.js
- Implementation:
  - Koa.js
  - TypeScript
- Data Sources:
  - Postgres (Knex)
- Infrastructure:
  - Docker
  - TBD | Digital Ocean
  - TBD | Github Actions
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
- Passport.js - Google OAuth20 to login with Gmail.
- Jwt - Set a jwt cookie once logged in.
- RBAC - Users have roles ('user' & 'admin') that are guarded with policies.
- Policies - Implemented per route/endpoint (Ie. isAuthenticated, isAdmin, isSelf).
- Encryption at rest - Node Crypto is used to encrypt/decrypt all user details.
- TBD | Encryption in transit - Digital Ocean provides SSL certificates for the api to be served via HTTPS protocol.

## Infraestructure:
- Docker: Dockerfile and .dockerignore files are available in this repository
  - You can check the [published Docker Image](https://hub.docker.com/repository/docker/ajnick/open-banking-sandbox) for this project

## I strived to adhere to SOLID principles:
- **Single Responsibility**: The project's structure exemplifies this, with each file dedicated to a single responsibility (routes, services, repositories, etc).
- **Open/Closed**: Not explicitly mentioned but implied through modular design that allows for extension without modification.
- **Liskov Substitution**: Observed through generic classes like `CrudRepository` or `DataSource`.
- **Interface Segregation**: Demonstrated with interfaces like `UserEntity` and `UserDto` and how other interfaces or classes that are used as types are configured.
- **Dependency Inversion**: Achieved through the strategic design of building an IoC Container and modularizing the project's architecture.

## Coding Patterns utilised:
- **Singleton**: To instantiate the IoC Container and Application class, amongst others.
- **Proxy**: While not a traditional use of the Proxy pattern, the encapsulation of each route in a RouterClass implements some proxy-like behaviour (lazy instantiation, controlling and managing access, etc).
- **Chain of Responsibility**: The request passes through a chain of middlewares until it is fully processed or rejected.
- **TBD | Strategy**: To choose between different Databases, to choose from different sorting algorithms, or to choose different authentication methods.
- **TBD | Iterator**: For the Binary Trees and Priority Queues I plan to implement.
- **TBD | Template Method**: For the register method in the Application class, or to validate data.

## Data Structures:
- **Map**: Used to keep track of dependencies in the IoCContainer.
- **Enum**: To implement roles for RBAC.
- **TBD | HashMap**: Will be used for caching.
- **TBD | Binary Trees**: A binary tree will be used to manage authentication and sessions (insertion/lookup).
- **TBD | Priority Queue with Binary Heap implementation**: A priority queue will be used for task scheduling (Ie. Password-reset emails should have higher priority than promotional ones).

## Algorithms:
- **Encryption**: Node's Crypto module is used for all user sensitive information.
- **TBD | Sorting**: So the API can return sorted results.
- **TBD | Binary Search**: In conjuction with the Binary Tree for session management.

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

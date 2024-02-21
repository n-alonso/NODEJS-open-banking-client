# WORK IN PROGRESS
The goal of this project is to construct a server using an Object-Oriented Programming (OOP) approach, adhering to clean code best practices.  

## TL;DR
I wanted to practice building my own Core Module which includes an Inversion of Control (IoC) container with register/resolve pattern and an Application class with register/bootstrap pattern to handle application lyfecycle.
The application register uses the `glob` package to scan the filesystem for components to loads them automatically.
I used a Module encapsulating a Route > Service > Repository architechture, which in turn connects to dynamic DataSources (Knex for supported SQL database and Mongoose for MongoDB).

This architecture should allow anyone to add new middlewares and new modules with ease with minimal to no configuration to the applciation itself.

## Table of Contents
- [Tech-Stack](#this-project-utilizes-the-following-technology-stack)
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
- Databases:
  - Postgres (Knex)
  - TBD | MongoDB (Mongoose)
- Infrastructure:
  - TBD | Google Cloud Platform (GPC)
  - TBD | Github Actions
  - TBD | Docker
- TBD | Testing:
  - TBD | Jest
- Other:
  - FS Scanning: Glob
  - Logger: Winston
  - Styling: Eslint, Prettier

## I strived to adhere to SOLID principles:
- **Single Responsibility**: The project's structure exemplifies this, with each file dedicated to a single responsibility (routes, services, repositories, etc).
- **Open/Closed**: Not explicitly mentioned but implied through modular design that allows for extension without modification.
- **Liskov Substitution**: Observed through generic classes like `CrudRepository` or `DataSource`.
- **Interface Segregation**: Demonstrated with interfaces like `UserEntity` and how other interfaces or classes that are used as types are configured.
- **Dependency Inversion**: Achieved through the strategic design of building an IoC Container and modularizing the project's architecture.

## Coding Patterns utilised:
- **Singleton**: To instantiate the IoC Container and Application class, amongst others.
- **Proxy**: While not a traditional use of the Proxy pattern, the encapsulation of each route in a RouterClass implements some proxy-like behaviour (lazy instantiation, controlling and managing access, etc).
- **Chain of Responsibility**: The request passes through a chain of middlewares until it is fully processed or rejected.
- **TBD | Strategy**: To choose between different Databases, to choose from different sorting algorithms, or to choose different authentication methods.
- **TBD | Iterator**: For the Binary Trees and Priority Queues I plan to implement.
- **TBD | Visitor**: For policies that get 'read-only' access to the request context and reject/allow the request to proceed.
- **TBD | Template Method**: To validate data.

## Data Structures:
- **Map**: Used to keep track of dependencies in the IoCContainer.
- **TBD | HashMap**: Im planning to use it for caching.
- **TBD | Set**: Im planning to use it to keep track of roles and permissions for RBAC.
- **TBD | Binary Trees**: A binary tree will be used to manage authentication and sessions (insertion/lookup).
- **TBD | Priority Queue with Binary Heap implementation**: A priority queue will be used for task scheduling (Ie. Password-reset emails should have higher priority than promotional ones).

## Algorithms:
- **TBD | Sorting**: So the API can return sorted results.
- **TBD | Binary Search**: In conjuction with the Binary Tree for session management.
- **TBD | Hashing/Encryption**: For all sensitive information (Ie. Passwords).

## Installation
TBD

## Usage
TBD

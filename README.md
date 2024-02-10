# WIP

## This project utilizes the following technology stack:
- Node.js
- Koa.js
- TypeScript
- TBD | Jest
- TBD | Knex
- TBD | Databases: Postgres, MongoDB

## The aim of this project is to construct a server using an Object-Oriented Programming (OOP) approach, adhering to clean code best practices.  
I developed a custom **Core Module** without any dependencies, which includes:
- An **IoC Container** for Dependency Injection.
- An Application class to manage the **Application Lifecycle** (registration, bootstrapping).
- The server lifecycle is designed to integrate new components with minimal effort.

## We strive to adhere to SOLID principles:
- **Single Responsibility**: The project's structure exemplifies this, with each file dedicated to a single responsibility (routes, services, repositories, etc.).
- **Open/Closed**: Not explicitly mentioned but implied through modular design that allows for extension without modification.
- **Liskov Substitution**: Not observed yet, as there are no parent classes or extended interfaces currently in place.
- **Interface Segregation**: Demonstrated by the implementation of distinct Config classes, although further examples are pending.
- **Dependency Inversion**: Achieved through the strategic design of building an IoC Container and modularizing the project's structure (routes, services, repositories, etc.).

## Coding Patterns utilised:
- **Singleton**: To instantiate the IoC Container and Application class.
- **Iterator**: To register components.
- **Proxy**: By accessing the IoC Container only through the Application class.
- **TBD | Chain of Responsibility**: To apply request middlewares in the correct order.
- **TBD | Strategy**: To choose between different Databases.
- **TBD | Visitor**: For policies that should not have access to the request/response context.
- **TBD | Template Method**: To validate data.

## Data Structures: TBD

## Algorithms: TBD

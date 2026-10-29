# BookingRules for Node.js

**A Node.js 24 and TypeScript implementation of the BookingRules project,
demonstrating SOLID principles, dependency injection, consistent repository
reads, and automated testing with the native Node.js test runner.**

This project implements the same reservation rules, decisions, and console
examples as the Delphi 10.4 and .NET versions, with additional runtime tests
for JavaScript-specific numeric values.

## Features

- Reservation confirmation based on customer status and participant count.
- Detailed decisions explaining why a reservation was refused.
- Dependency injection through the `CustomerRepository` interface.
- Single customer-status lookup through one `tryGetStatus` call.
- In-memory repository implementation.
- Unit tests using Fake, Spy, and failure-simulating repositories.
- Integration tests combining the domain with the in-memory repository.
- Console application demonstrating valid and invalid reservations.
- Strict TypeScript compilation with no unchecked indexed access.

## Business Rules

A reservation can be confirmed only when:

1. The participant count is a safe integer between 1 and 5.
2. The customer exists and is active.
3. The customer is not blocked.

Repository errors are propagated rather than silently ignored.

`Reservation.evaluate` returns a `ReservationDecision`. For callers that need
only a Boolean answer, `Reservation.canConfirm` remains available.

| Decision | Meaning |
|---|---|
| `Confirmed` | All reservation rules were satisfied. |
| `InvalidParticipantCount` | The participant count is outside the accepted range. |
| `RepositoryUnavailable` | No customer repository was supplied. |
| `CustomerNotFound` | The repository could not find the customer. |
| `CustomerInactive` | The customer exists but is inactive. |
| `CustomerBlocked` | The customer is active but blocked. |

## Architecture

```text
BookingRules/
├── src/
│   ├── domain/
│   │   ├── customer-repository.ts
│   │   ├── customer-status.ts
│   │   ├── reservation-decision.ts
│   │   └── reservation.ts
│   ├── infrastructure/
│   │   └── in-memory-customer-repository.ts
│   └── console/
│       └── main.ts
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
└── tsconfig.json
```

- `domain` contains the business rules and repository contract.
- `infrastructure` contains the in-memory repository.
- `console` is the executable demonstration.
- Unit and integration tests are kept in separate directories.

The domain has no dependency on the infrastructure or console layers.

## Requirements

- Node.js 24 or later
- npm 11 or later

The exact dependency tree is recorded in `package-lock.json`.

## Install, Build, and Run

Install the exact development dependencies recorded in `package-lock.json`:

```powershell
npm ci
```

Compile TypeScript:

```powershell
npm run build
```

Run the console demonstration:

```powershell
npm start
```

Run all tests:

```powershell
npm test
```

Run a specific test group:

```powershell
npm run test:unit
npm run test:integration
```

## Automated Testing

Tests use the native `node:test` runner and `node:assert/strict`, avoiding a
runtime dependency on an external test framework.

**Last verified execution:** October 29, 2026, using Node.js 24.20.0,
TypeScript 5.9.3, and npm 11.19.0.

| Test group | Passed | Failed | Skipped |
|---|---:|---:|---:|
| Unit tests | 19 | 0 | 0 |
| Integration tests | 6 | 0 | 0 |
| **Total** | **25** | **0** | **0** |

## Cross-Language Equivalence

| Delphi | C# / .NET | Node.js / TypeScript |
|---|---|---|
| `TReservation` | `Reservation` | `Reservation` |
| `TReservationDecision` | `ReservationDecision` | `ReservationDecision` |
| `TCustomerStatus` | `CustomerStatus` | `CustomerStatus` |
| `ICustomerRepository` | `ICustomerRepository` | `CustomerRepository` |
| `TInMemoryCustomerRepository` | `InMemoryCustomerRepository` | `InMemoryCustomerRepository` |
| DUnitX | MSTest | `node:test` |

TypeScript represents a missing customer with `undefined`, which is the
idiomatic equivalent of the Delphi and C# `TryGetStatus` Boolean result plus an
output status value. The design still performs a single repository lookup for
each valid evaluation.

## Scope

BookingRules is an educational and portfolio demonstration, not a production
booking platform. It focuses on business rules, layered architecture,
cross-language equivalence, and automated tests.

## Author

**Marcelo Gutierrez**

[GitHub](https://github.com/mgmsystem)

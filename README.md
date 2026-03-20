<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Campytech Backend (NestJS + Prisma)

This repository is a modular NestJS API backend built with Clean Architecture principles. The current feature set includes:

- `auth` module
- `blog`, `tag`, `comment`, `category` modules
- `common` utilities (logging, pipes, exception filter, token, etc.)
- Prisma ORM persistence and repository adapters
- Zod validation pipes and strong type-safe DTOs

## Category Module (Implemented)

The `category` feature is implemented with a clear domain-driven design:

- `modules/category/domain`:
  - Entities/Value Objects for `Category`
- `modules/category/application`:
  - `ports/inbound/CategoryInboundPortService` (use case contract)
  - `ports/outbound/CategoryRepositoryOutputPortService` (persistence contract)
  - `services/CategoryService` (business logic)
- `modules/category/infrastructure`:
  - Prisma-based repository adapter (fulfills outbound port)
- `modules/category/presenters`:
  - Mappers / resource transformations

### Key interfaces/abstract classes

- `CategoryInboundPortService`:
  - create
  - findById
  - findAll
  - findBySlug
  - update
  - delete

- `CategoryRepositoryOutputPortService`:
  - create
  - findById
  - findAll
  - findBySlug
  - update
  - delete

## Getting started

```bash
pnpm install
pnpm run start:dev
```

### Schema migration

```bash
pnpm run prisma:migrate
pnpm run prisma:studio
```

### Tests

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

## Endpoints

(Assuming controllers are wired, adapt as needed.)

- `POST /category`
- `GET /category`
- `GET /category/:id`
- `GET /category/slug/:slug`
- `PUT /category/:id`
- `DELETE /category/:id`

## Contributing

- Follow the module-based architecture in `src/modules/*`
- Extend inbound/outbound ports first before concrete implementations
- Keep domain logic in `domain`, application logic in `application`, and persistence in `infrastructure`

## Notes

- Interface docs have been added in `src/modules/category/application/ports/inbound/category-inbound-port.service.ts` and `src/modules/category/application/ports/outbound/category-repository-outbound-port.service.ts`.

---

Updated from starter Nest README to reflect Campytech backend implementation.

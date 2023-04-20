## Description
This is a NestJS backend for Queue System. It exposes REST API and
communicates via WebSocket.

## Installation
To run the app install modules first.
```bash
$ yarn install
```

## Database
Start a database with docker.
```bash
$ docker-compose up database
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test
```

## Lint
To lint the files run
```bash
$ yarn run lint
```
which will check for TS errors also.
###
You can fix some errors with
```bash
$ yarn run lint:fix
```

or format the code with
```bash
$ yarn run prettier
```

## Documentation
API is documented with Swagger. It is available on http://localhost:3000/api or 
http://localhost:3000/api-json for JSON format. Make sure that the
dev server is running.
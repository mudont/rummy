# A Fullstack starter project

## Features

Bootstrapped with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript)

That gives us

- [x] `Express` app with a reasobable file layout
- [x] `Typescript` code, with build and run scripts
- [x] `Rest API`
- [x] `socket.io`
- [-] Local auth which we removed
- [-] A simple HTML/JS client which needs to be replaced

Then we added features:

- [x] Passport auth framework
- [x] `Keycloak` Auth
- [x] Hacky `JWT` auth (couldn't quickly get passport-jwt working. need to revisit)
- [x] `Prisma`/`postgresql`
- [x] Apollo-Express `GraphQL`
- [x] Generated schema resolvers with [typegraphql-prisma](https://github.com/MichalLytek/typegraphql-prisma)
- [x] Role based (`RBAC)` Authorization for GraphQL objects ([Read this nice looking express/graphql/prisma repo](https://github.com/corona-school/backend))
- [ ] Owner (ABAC) Authorization for GraphQL objects
- [x] `React` front end ([How to serve](https://stackoverflow.com/questions/53234140/react-expressjs-backend-cant-serve-static-frontend)) / [Example with kanban](https://github.com/drkPrince/agilix)
- [x] GraphQL Subscriptions
- [x] Pretty front end
  - Tailwind UI is a wrapper over Tailwind
  - https://flowbite.com has some higher level components over tailwind
- [ ] Tetsts in `spec` dir
- [ ] [fluentd](https://github.com/fluent/fluentd) logging

## Known issues

- See https://github.com/wellyshen/react-cool-starter . This probably has ideas to steal from
  it uses a single port. client and server are integrated. universal architecture.
- Needs refactoring.

  - Server code is hacked together. The purpose of each line should be clear, but isn't
  - API, GraphQL and Socket.io code should be seprated.
  - Database code shoud exist only in services

- ~~Keycloak logout leaves user on a Keycloak screen instead of returning them to app. Also, it actally logs our user only on Chrome. On Firefox and Safari, they stay logged in~~

## Running Server

Edit `.env` (see `.env.sample`) and configs in `src/pre-start/env`

```
yarn
npx prisma migrate dev -n init
npx prisma generate # needs to be re-run after every npm install
npm run start:dev
```

That should print the URL (port 8183). You can try it for GraphQL studio.
Just the root URL should show a login link to Keycloak. If login is successful,
a list of users and a Chat button. The chat uses `Socket.io`

Port 8183 is hardcoded

https://ex1.cmhackers.com redirects to this port

## Running the React client.

```
npm rum start
```

Will start on 3000 or next available port

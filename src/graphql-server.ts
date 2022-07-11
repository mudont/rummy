import "reflect-metadata";
import prisma from "@services/prisma";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import { Express, Request } from "express";
import * as tq from "type-graphql";
import {
  resolvers,
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
} from "../prisma/@generated/typegraphql";

import * as models from "../prisma/@generated/typegraphql";

import {
  ArgsType,
  Authorized,
  AuthChecker,
  Field,
  Resolver,
  Ctx,
  Query,
  Mutation,
  Arg,
  PubSub,
  Publisher,
  Subscription,
  Root,
  ID,
  ResolverFilterData,
  Args,
  InputType,
  ObjectType,
} from "type-graphql";

import { DateTimeResolver } from "graphql-scalars";
import { FieldsOnCorrectTypeRule, GraphQLScalarType } from "graphql";
import { Server as SocketIo } from "socket.io";
import Debug from "debug";
import assert from "assert";
import { MyRequest, User } from "./types";
import { PrismaClient, Role } from "@prisma/client";
import path from "path/posix";
import jwtUtil, { authHeaderToUser, getBearerToken } from "@lib/jwt-util";
import userSvc from "@services/user-service";
import { Context } from "@apollo/client";
import Redis, { RedisOptions } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

// REDIS subscription example from
// https://github.dev/MichalLytek/type-graphql/tree/master/examples/redis-subscriptions
const REDIS_HOST = "localhost";
const REDIS_PORT = 6379;

const debug = Debug("app:graphqlServer");
const pubSub = new RedisPubSub();
const options: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  retryStrategy: (times) => Math.max(times * 100, 3000),
};

@ArgsType()
export class NewMessageArgs {
  @Field((type) => ID)
  id!: string;
}
@InputType()
export class MessageInput {
  @Field()
  message!: string;
}

@ObjectType()
export class NewMessagePayload {
  @Field()
  user!: string;

  @Field()
  message!: string;
}
@Resolver()
export class SubscriptionResolver {
  // NoExplicitTypeError: Unable to infer GraphQL type from TypeScript reflection system.
  // You need to
  // provide explicit type for argument named 'message' of
  // 'addNewMessage' of 'SubscriptionResolver' class.

  // Mutation /////////////////////////////

  @Authorized("ADMIN")
  @Mutation((returns) => Boolean)
  async addNewMessage(
    @Ctx() ctx: GraphQLContext,
    @Arg("message") input: MessageInput,
    @PubSub("MESSAGES")
    notifyAboutNewMessage: Publisher<NewMessagePayload>
  ): Promise<boolean> {
    // const recipe = this.recipes.find((r) => r.id === input.recipeId);
    if (input.message == "23") {
      return false;
    }

    const user = ctx.user?.username ?? "anon";
    const message = input.message;
    // recipe.messages.push(message);
    await notifyAboutNewMessage({ user, message });
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Authorized("ADMIN")
  // Subscription //////////////////////////////////
  // eslint-disable-next-line @typescript-eslint/require-await
  @Subscription((returns) => NewMessagePayload, {
    topics: "MESSAGES",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<NewMessagePayload, NewMessageArgs>) => {
      return payload.message.includes(args.id);
    },
  })
  async newMessage(
    @Ctx() ctx: GraphQLContext,
    @Root() newMessage: NewMessagePayload, // MessageInput,
    @Args() { id }: NewMessageArgs
  ): Promise<NewMessagePayload> {
    // const un = ctx.user?.username ?? "anon";
    return newMessage; // `${un}: ${newMessage.message}`;
  }
}

type ResolverModelNames = keyof typeof models;
// type ResolverModel<Name extends ResolverModelNames> =
//   typeof models[Name]["prototype"];

interface GraphQLContext {
  user: User;
  prisma: PrismaClient;
}

// eslint-disable-next-line @typescript-eslint/require-await
async function accessCheck(
  context: GraphQLContext,
  requiredRoles: Role[],
  modelName: ResolverModelNames | undefined,
  root: any
) {
  if (!context.user) {
    return false;
  }
  if (
    requiredRoles.some((requiredRole) =>
      context.user.roles.includes(requiredRole as string)
    )
  ) {
    debug(
      `Access check successful ${JSON.stringify(
        requiredRoles
      )} in ${JSON.stringify(context.user.roles)}`
    );
    return true;
  }

  ////////////////////////////////////////
  // Can check objet owner if requiredRoles contains OWNER
  // Will need to define a method for each relation that
  // takes a user and an instance of that relation
  // and tells us if he is owner
  ////////////////////////////////////////
  // debug(
  //   `${JSON.stringify(requiredRoles)} not in ${JSON.stringify(
  //     context.user.roles
  //   )}`
  // );
  return false;
}
const authChecker: AuthChecker<GraphQLContext> = async (
  { context, info, root },
  requiredRoles
) => {
  // debug(`authChecker: User: ${JSON.stringify(context.user)}`);
  assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");
  assert(
    requiredRoles.every((role) => role in Role),
    "Roles must be of enum Role"
  );
  assert(context.user, "authGql: User is not authenticated");
  assert(context.user?.roles, "Roles must have been initialized in context");

  context.user?.roles;
  return await accessCheck(
    context,
    requiredRoles as Role[],
    info.parentType?.name as ResolverModelNames,
    root
  );
};

@Resolver()
export class UserJwtResolver {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Query((returns) => String, { nullable: true })
  async getJwt(
    @Ctx() { prisma, user }: Context
  ): Promise<string | undefined | null> {
    if (!user) {
      return "You are not Authenticated";
    }
    //debug(`Getting JWT for user:${JSON.stringify(user.email)}`);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    const u: models.User = await prisma.user.findUnique({
      where: { email: user.email },
    });
    //debug(`Got user ${JSON.stringify(u)}`);
    return u?.jwt;
  }
}

const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    deleteUser: [Authorized(Role.ADMIN)],
  },
};

// eslint-disable-next-line @typescript-eslint/require-await
async function injectContext({ req }: { req: Request }) {
  const jwt = getBearerToken(req);
  let profile, decodedUser;
  if (jwt) {
    try {
      profile = jwtUtil.decodeSync(jwt) as Record<string, any>;
    } catch (e: unknown) {
      // debug(`DBG injectContext No valid JWT`);
    }
  } else {
    // debug(`DBG injectContext no JWT`);
  }
  if (profile) {
    // debug(`DBG injectContext Decoded JWT: ${jwt.substring(0, 100)}`);
    decodedUser = userSvc.profileToUser(profile) as User;
    // debug(
    //   `DBG injectContext Decoded JWT: Roles: ${JSON.stringify(
    //     decodedUser.roles
    //   )} ${JSON.stringify(decodedUser).substring(0, 100)}`
    // );
  }
  const user = (req?.user || decodedUser) as User;
  const context: GraphQLContext = { prisma, user };
  return context;
}

function addSocketIO(httpServer: http.Server, app: Express) {
  const io = new SocketIo(httpServer);
  io.sockets.on("connect", () => {
    debug(`Socket connect`);
    return app.set("socketio", io);
  });
  io.sockets.on("connectopn", () => {
    debug(`Socket connection`);
  });
}
async function graphqlServer(app: Express) {
  const httpServer = http.createServer(app);

  applyResolversEnhanceMap(resolversEnhanceMap);
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, UserJwtResolver, SubscriptionResolver],
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    authChecker,
    pubSub,
  });

  // Creating the WebSocket server
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: "/graphql",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx, msg, args) => {
        debug(`subs ctx.cP: ${JSON.stringify(ctx.connectionParams)}`);
        const auth = ctx.connectionParams?.authorization as string;
        const user = authHeaderToUser(auth);
        debug(`subs user: ${JSON.stringify(user).substring(0, 300)}`);
        return { user, prisma };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    // playground: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        // eslint-disable-next-line @typescript-eslint/require-await
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: injectContext,
  });
  await server.start();

  server.applyMiddleware({ app });
  const port = process.env.PORT || 3000;
  // old fashioned chat
  addSocketIO(httpServer, app);
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );

  return server;
}

export default graphqlServer;

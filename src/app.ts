import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { auditRoutes } from './routes/audit.routes';
import mongoose from 'mongoose';
import { config } from './config/config';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: 'https://bozinoski.com', // Or '*' for all domains (less secure)
  methods: ['GET', 'POST', 'PUT', "DELETE"],  // Include methods your API uses
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Add custom headers if needed
});

// Register Swagger Plugin (this generates the OpenAPI documentation)
app.register(swagger, {
  swagger: {
    info: {
      title: 'Audit Logs API',
      description: 'API documentation for the Audit Logs service',
      version: '1.0.0',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    schemes: ['https'],
    basePath: '/api',
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
});

// Register Swagger UI Plugin (this serves the Swagger UI documentation)
app.register(swaggerUi, {
  routePrefix: '/docs', // Route to access Swagger UI
  staticCSP: true,
  transformStaticCSP: (header) => header,
  uiConfig: {
    docExpansion: 'full', // Expand all sections in the UI
    deepLinking: false,
  },
  uiHooks: {
    onRequest: (request, reply, next) => next(),
    preHandler: (request, reply, next) => next(),
  },
});

// Register routes
app.register(auditRoutes);

export const startServer = async () => {
  try {
    // Use the database URI from the centralized config
    await mongoose.connect(config.database.uri);

    // Use the port from the centralized config
    await app.listen({ port: config.app.port, host: '0.0.0.0' });
    console.log(`Server is running on port ${config.app.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
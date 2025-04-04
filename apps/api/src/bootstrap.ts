import './instrument';

import helmet from 'helmet';
import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';

import { BullMqService, getErrorInterceptor, Logger as PinoLogger } from '@novu/application-generic';
import { CONTEXT_PATH, corsOptionsDelegate, validateEnv } from './config';
import { AppModule } from './app.module';
import { setupSwagger } from './app/shared/framework/swagger/swagger.controller';
import { ResponseInterceptor } from './app/shared/framework/response.interceptor';
import { AllExceptionsFilter } from './exception-filter';

const passport = require('passport');
const compression = require('compression');

const extendedBodySizeRoutes = [
  '/v1/events',
  '/v1/notification-templates',
  '/v1/workflows',
  '/v1/layouts',
  '/v1/bridge/sync',
  '/v1/bridge/diff',
];

// Validate the ENV variables after launching SENTRY, so missing variables will report to sentry
validateEnv();
class BootstrapOptions {
  internalSdkGeneration?: boolean;
}

export async function bootstrap(
  bootstrapOptions?: BootstrapOptions
): Promise<{ app: INestApplication; document: any }> {
  BullMqService.haveProInstalled();

  let rawBodyBuffer: undefined | ((...args) => void);
  let nestOptions: Record<string, boolean> = {};

  if (process.env.NOVU_ENTERPRISE === 'true' || process.env.CI_EE_TEST === 'true') {
    rawBodyBuffer = (req, res, buffer, encoding): void => {
      if (buffer && buffer.length) {
        // eslint-disable-next-line no-param-reassign
        req.rawBody = Buffer.from(buffer);
      }
    };
    nestOptions = {
      bodyParser: false,
      rawBody: true,
    };
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true, ...nestOptions });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: `${CONTEXT_PATH}v`,
    defaultVersion: '1',
  });

  app.useLogger(app.get(PinoLogger));
  app.flushLogs();

  const server = app.getHttpServer();
  Logger.verbose(`Server timeout: ${server.timeout}`);
  server.keepAliveTimeout = 61 * 1000;
  Logger.verbose(`Server keepAliveTimeout: ${server.keepAliveTimeout / 1000}s `);
  server.headersTimeout = 65 * 1000;
  Logger.verbose(`Server headersTimeout: ${server.headersTimeout / 1000}s `);

  app.use(helmet());
  app.enableCors(corsOptionsDelegate);

  app.use(passport.initialize());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(getErrorInterceptor());

  app.use(extendedBodySizeRoutes, bodyParser.json({ limit: '20mb' }));
  app.use(extendedBodySizeRoutes, bodyParser.urlencoded({ limit: '20mb', extended: true }));

  app.use(bodyParser.json({ verify: rawBodyBuffer }));
  app.use(bodyParser.urlencoded({ extended: true, verify: rawBodyBuffer }));

  app.use(compression());

  const document = await setupSwagger(app, bootstrapOptions?.internalSdkGeneration);

  app.useGlobalFilters(new AllExceptionsFilter(app.get(PinoLogger)));

  await app.listen(process.env.PORT || 3000);

  app.enableShutdownHooks();

  Logger.log(`Started application in NODE_ENV=${process.env.NODE_ENV} on port ${process.env.PORT}`);

  return { app, document };
}

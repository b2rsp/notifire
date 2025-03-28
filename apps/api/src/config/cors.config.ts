import { INestApplication } from '@nestjs/common';
import { HttpRequestHeaderKeysEnum } from '@novu/application-generic';

export const corsOptionsDelegate: Parameters<INestApplication['enableCors']>[0] = function (req: Request, callback) {
  const corsOptions: Parameters<typeof callback>[1] = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    maxAge: 86400,
    allowedHeaders: Object.values(HttpRequestHeaderKeysEnum),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  if (enableWildcard(req)) {
    corsOptions.origin = '*';
  } else {
    corsOptions.origin = [];

    // Enable preview deployments in staging environment for Netlify and Vercel
    const isDevNodeEnv = process.env.NODE_ENV === 'dev';
    const requestOrigin = origin(req);
    const isAllowedOrigin = new RegExp(process.env.FRONT_BASE_URL).test(requestOrigin);
    if (isAllowedOrigin || isDevNodeEnv) {
      corsOptions.origin.push(requestOrigin);
    }
    if (process.env.WIDGET_BASE_URL) {
      corsOptions.origin.push(process.env.WIDGET_BASE_URL);
    }
    // Enable CORS for the docs
    if (process.env.DOCS_BASE_URL) {
      corsOptions.origin.push(process.env.DOCS_BASE_URL);
    }
  }

  callback(null as unknown as Error, corsOptions);
};

function enableWildcard(req: Request): boolean {
  return isSandboxEnvironment() || isWidgetRoute(req.url) || isInboxRoute(req.url) || isBlueprintRoute(req.url);
}

function isWidgetRoute(url: string): boolean {
  return url.startsWith('/v1/widgets');
}

function isInboxRoute(url: string): boolean {
  return url.startsWith('/v1/inbox');
}

function isBlueprintRoute(url: string): boolean {
  return url.startsWith('/v1/blueprints');
}

function isSandboxEnvironment(): boolean {
  return ['test', 'local'].includes(process.env.NODE_ENV || '');
}

function origin(req: Request): string {
  return (req.headers as any)?.origin || '';
}

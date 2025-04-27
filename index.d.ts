import { JwtPayload } from '~/common/models';

export declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;

      NODE_ENV?: string;

      APP_NAME?: string;

      AMQP_URL?: string;
      AMQP_PREFETCH_COUNT?: string;

      DB_HOST?: string;
      DB_PORT?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
      DB_LOGGING?: string;
      DB_SYNC?: string;

      JWT_EXP_TIME?: string;
      JWT_SECRET_KEY?: string;

      MQTT_URL?: string;

      REDIS_HOST?: string;
      REDIS_PORT?: string;
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { getLocale, initI18n } from '~/utils';

export const i18n = (req: Request, _: Response, next: NextFunction) => {
  initI18n(getLocale(req.acceptsLanguages()));
  next();
};

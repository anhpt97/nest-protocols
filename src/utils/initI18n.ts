import { use } from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import { join } from 'path';
import { Locale } from '~/common/enums';

export const initI18n = (locale: Locale) =>
  void use(I18NexFsBackend).init({
    backend: { loadPath: join(process.cwd(), 'locales', `${locale}.json`) },
    initImmediate: false,
  });

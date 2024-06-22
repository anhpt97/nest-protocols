import { Locale } from '~/common/enums';

const locales = Object.values(Locale);

export const getLocale = (languages: Locale | string[]) =>
  (Array.isArray(languages)
    ? (languages as Locale[]).find((locale) => locales.includes(locale))
    : locales.find((locale) => locale === languages)) || Locale.En;

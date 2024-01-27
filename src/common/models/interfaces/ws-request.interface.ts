import { Locale } from '~/common/enums';

export interface WsRequest {
  locale: Locale;
  [key: string]: any;
}

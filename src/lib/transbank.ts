import { WebpayPlus, Environment, IntegrationApiKeys, IntegrationCommerceCodes } from 'transbank-sdk';

const isProd = process.env.NODE_ENV === 'production';

export const webpay = isProd
  ? new WebpayPlus.Transaction({
      commerceCode: process.env.TRANSBANK_COMMERCE_CODE!,
      apiKey: process.env.TRANSBANK_API_KEY!,
      environment: Environment.Production,
    })
  : new WebpayPlus.Transaction({
      commerceCode: IntegrationCommerceCodes.WEBPAY_PLUS,
      apiKey: IntegrationApiKeys.WEBPAY,
      environment: Environment.Integration,
    });
// DOKU Checkout Non-SNAP channel IDs. QRIS requests use QRIS, while
// notifications use QRIS_DOKU. Keep the database allowlist in sync.
// https://developers.doku.com/accept-payments/doku-checkout/configuration/supported-payment-methods
export const DOKU_CHANNELS = Object.freeze([
  'QRIS_DOKU',
  'VIRTUAL_ACCOUNT_BCA', 'VIRTUAL_ACCOUNT_BANK_MANDIRI',
  'VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI', 'VIRTUAL_ACCOUNT_BRI',
  'VIRTUAL_ACCOUNT_BNI', 'VIRTUAL_ACCOUNT_DOKU',
  'VIRTUAL_ACCOUNT_BANK_PERMATA', 'VIRTUAL_ACCOUNT_BANK_CIMB',
  'VIRTUAL_ACCOUNT_BANK_DANAMON', 'VIRTUAL_ACCOUNT_BTN',
  'VIRTUAL_ACCOUNT_BNC', 'VIRTUAL_ACCOUNT_BSS', 'VIRTUAL_ACCOUNT_BJB',
  'VIRTUAL_ACCOUNT_SINARMAS', 'VIRTUAL_ACCOUNT_Sinarmas',
  'ONLINE_TO_OFFLINE_ALFA', 'ONLINE_TO_OFFLINE_INDOMARET',
  'EMONEY_OVO', 'EMONEY_SHOPEE_PAY', 'EMONEY_DOKU',
  'EMONEY_LINKAJA', 'EMONEY_DANA',
  'PEER_TO_PEER_AKULAKU', 'PEER_TO_PEER_KREDIVO', 'PEER_TO_PEER_INDODANA',
  'DIRECT_DEBIT_BRI', 'JENIUS_PAY',
  'CREDIT_CARD', 'GOOGLE_PAY', 'KARTU_KREDIT_INDONESIA',
]);
const channels = new Set(DOKU_CHANNELS);
const cards = new Set(['CREDIT_CARD', 'GOOGLE_PAY', 'KARTU_KREDIT_INDONESIA']);

/** @param {unknown} channel */
export function isDokuChannel(channel) {
  return typeof channel === 'string' && channels.has(channel);
}

/**
 * An authorization can be SUCCESS without collecting payment. Only a sale or
 * completed capture can grant access for cards; we request SALE at checkout.
 * @param {unknown} channel
 * @param {unknown} status
 * @param {unknown} transactionType
 */
export function isDokuSettlement(channel, status, transactionType) {
  return isDokuChannel(channel) &&
    (status !== 'SUCCESS' || !cards.has(channel) ||
      transactionType === 'SALE' || transactionType === 'CAPTURE');
}

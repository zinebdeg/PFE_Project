import { sendQuoteEmail } from '../rpc/quotes';
import type { QuoteRequest } from './types';

export async function createQuote(data: QuoteRequest): Promise<any> {
  // Call the server function to send the email using Resend
  return await sendQuoteEmail({ data });
}

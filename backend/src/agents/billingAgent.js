import { handleLLMError } from '../utils/llmErrorHandler.js';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import prisma from '../db/prisma.js';

async function billingAgent(message, conversationId) {
  try {
    console.log('💳 Billing Agent processing...');

    // 1. Fetch recent conversation context (for completeness)
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // 2. Extract invoice ID deterministically
    const invoiceMatch = message.match(/INV\d+/);

    if (!invoiceMatch) {
      return { success: true, text: 'Please provide a valid invoice ID (e.g., INV001).' };
    }

    const invoiceId = invoiceMatch[0];

    // 3. Fetch invoice from DB
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return { success: true, text: `I couldn't find any invoice with ID ${invoiceId}. Please double-check the invoice number.` };
    }

    // 4. Use LLM only to generate a clear response
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: `
You are a billing support assistant.
Explain invoice and payment information clearly and professionally.
Do not invent any data.
`,
      messages: [
        {
          role: 'user',
          content: `Invoice details:
Invoice ID: ${invoice.id}
Amount: ${invoice.amount}
Status: ${invoice.status}
Related Order: ${invoice.orderId}`
        }
      ]
    });

    console.log('✅ Billing Agent response generated');
    return { success: true, text: result.text };

  } catch (error) {
    console.error('❌ LLM Error:', error);

    const llmError = handleLLMError(error);

    return {
      success: false,
      error: llmError,
    };

  }
}

export { billingAgent };

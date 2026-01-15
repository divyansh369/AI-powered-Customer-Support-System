import { generateText } from 'ai';        
import { google } from '@ai-sdk/google';  
import prisma from '../db/prisma.js';
import { getConversationHistory } from '../tools/supportTools.js';
import { handleLLMError } from '../utils/llmErrorHandler.js';

async function supportAgent(message, conversationId) {
  try {
    const history = await getConversationHistory(conversationId);
    
    const messages = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    messages.push({
      role: 'user',
      content: message,
    });

    console.log('🤖 Support Agent processing...');

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: `You are a friendly customer support agent.

- Help with general inquiries, FAQs, and troubleshooting, such as password resets, account issues
- Be helpful, clear, and concise
- If users ask about orders or billing, ask for order/invoice numbers

Keep responses under 100 words.`,
      messages,
    });

    console.log('✅ Support Agent response generated');
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

export { supportAgent };
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { handleLLMError } from '../utils/llmErrorHandler.js';
import prisma from "../db/prisma.js";

async function orderAgent(message, conversationId) {
  try {
    console.log("📦 Order Agent processing...");

    // 1. Fetch recent conversation context
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    // 2. Extract order ID  
    const orderIdMatch = message.match(/ORD\d+/);
    if (!orderIdMatch) {
      return { success: true, text: "Please provide a valid order ID (e.g., ORD001)." };
    }

    const orderId = orderIdMatch[0];

    // 3. Fetch order from DB 
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: true, text: `I couldn't find any order with ID ${orderId}. Please double-check the order number.` };
    }

    // 5. Handle common requests directly
    if (message.toLowerCase().includes('cancel')) {
      return { success: true, text: `Order ${orderId} cancellation request received. Our team will process it shortly.` };
    }

    if (message.toLowerCase().includes('modify')) {
      return { success: true, text: `Order ${orderId} modification request received. Please specify changes.` };
    }

    // 4. Use LLM ONLY to generate a human-friendly response
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: `
You are an order support assistant.
Your job is to clearly explain order status to customers.
Be concise and professional.
`,
      messages: [
        {
          role: "user",
          content: `Order details:
Order ID: ${order.id}
Status: ${order.status}
User ID: ${order.userId}`,
        },
      ],
    });
    
    console.log("✅ Order Agent response generated");
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

export { orderAgent };
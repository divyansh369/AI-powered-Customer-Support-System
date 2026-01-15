import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function routeMessage(message) {
  const lower = message.toLowerCase();

  if (
    ["tracking", "delivery", "shipping", "packages"].some((k) =>
      lower.includes(k)
    )
  ) {
    return "order";
  }
  if (
    ["refund", "invoice", "payment", "charge"].some((k) => lower.includes(k))
  ) {
    return "billing";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `You are a customer support router. Analyze this message and determine the intent.
    Respond with ONLY ONE WORD (lowercase):
    - "order" - if about order status, tracking, delivery, shipping, packages
    - "billing" - if about payments, refunds, invoices, charges, money
    - "support" - if about account help, technical issues, general questions, how-to, password

    Examples:
    "Where is my order?" → order
    "I need a refund" → billing  
    "How do I reset my password?" → support

    Message: "${message}"

    Intent (one word only):`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const intent = response
      .text()
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    // Validate the intent
    if (["order", "billing", "support"].includes(intent)) {
      console.log(`✅ Routed to: ${intent}`);
      return intent;
    }

    console.log(`⚠️ Invalid intent "${intent}", defaulting to support`);
    return "support";
  } catch (error) {
    console.error("❌ Router error:", error.message);
    return "support"; // Fallback on error
  }
}

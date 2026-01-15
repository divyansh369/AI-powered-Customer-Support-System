import prisma from "../db/prisma.js";
import { rateLimit } from '../middleware/rateLimit.js';
import { routeMessage } from "../agents/router.js";
import { supportAgent } from "../agents/supportAgent.js";
import { orderAgent } from "../agents/orderAgent.js";
import { billingAgent } from "../agents/billingAgent.js";

const chatRoute = (app) => {
  app.use('/api/chat/messages', rateLimit({ windowMs: 60_000, limit: 20 }));
  app.post("/api/chat/messages", async (c) => {
    try {
      const { message, conversationId } = await c.req.json();

      const convo =
        conversationId ?? (await prisma.conversation.create({ data: {} })).id;

      await prisma.message.create({
        data: {
          conversationId: convo,
          role: "user",
          content: message,
        },
      });

      const intent = await routeMessage(message);
      let agentResult;

      if (intent === "order") {
        agentResult = await orderAgent(message, convo);
      } else if (intent === "billing") {
        agentResult = await billingAgent(message, convo);
      } else {
        agentResult = await supportAgent(message, convo);
      }

      if (!agentResult.success) {
        return c.json(
          {
            error: agentResult.error.code,
            message: agentResult.error.userMessage,
          },
          agentResult.error.status
        );
      }

      await prisma.message.create({
        data: {
          conversationId: convo,
          role: "agent",
          content: agentResult.text,
          agentType: intent,
        },
      });

      return c.json({ conversationId: convo, response: agentResult.text });
      
    } catch (error) {
      console.error("❌ Chat error:", error);
      return c.json(
        { error: "Failed to process message", details: error.message },
        500
      );
    }
  });
};

export { chatRoute };

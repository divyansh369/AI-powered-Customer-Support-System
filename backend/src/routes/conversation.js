import { Hono } from 'hono';
import prisma from '../db/prisma.js';

const conversationsRoute = new Hono();

/**
 * GET /api/conversations
 * List all conversations
 */
conversationsRoute.get('/', async (c) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return c.json(conversations);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch conversations' }, 500);
  }
});

/**
 * GET /api/conversations/:id
 * Get conversation with messages
 */
conversationsRoute.get('/:id', async (c) => {
  const { id } = c.req.param();

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    return c.json(conversation);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch conversation' }, 500);
  }
});

/**
 * DELETE /api/conversations/:id
 * Delete conversation + messages
 */
conversationsRoute.delete('/:id', async (c) => {
  const { id } = c.req.param();

  try {
    await prisma.message.deleteMany({
      where: { conversationId: id },
    });

    await prisma.conversation.delete({
      where: { id },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to delete conversation' }, 500);
  }
});

export default conversationsRoute;

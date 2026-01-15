import prisma  from '../db/prisma.js'

export async function getConversationHistory(conversationId, limit = 20) {
    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}
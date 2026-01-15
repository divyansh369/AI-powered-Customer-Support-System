import prisma  from '../db/prisma.js'

export async function getOrderById(orderId) {
    return await prisma.order.findUnique({
        where: { id: orderId },
    });
}
import prisma from '../db/prisma.js';

export async function getRefundStatus(invoiceId) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId }
  });

  if (!invoice) return null;

  return {
    invoiceId,
    refundStatus: invoice.status === 'REFUNDED'
      ? 'Refund completed'
      : 'No refund requested'
  };
}

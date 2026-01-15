import { Hono } from 'hono';

const agentsRoute = new Hono();

/**
 * GET /api/agents
 * List available agents
 */
agentsRoute.get('/', (c) => {
  return c.json([
    {
      type: 'support',
      description: 'Handles general support, FAQs, and troubleshooting'
    },
    {
      type: 'order',
      description: 'Handles order status, tracking, and order-related issues'
    },
    {
      type: 'billing',
      description: 'Handles billing, invoices, and payment-related issues'
    }
  ]);
});

/**
 * GET /api/agents/:type/capabilities
 * Get capabilities of a specific agent
 */
agentsRoute.get('/:type/capabilities', (c) => {
  const { type } = c.req.param();

  const capabilitiesMap = {
    support: [
      'Answer general questions',
      'Provide troubleshooting steps',
      'Handle FAQs'
    ],
    order: [
      'Track order status',
      'Check delivery progress',
      'Handle order-related queries'
    ],
    billing: [
      'Retrieve invoice details',
      'Explain billing charges',
      'Handle payment issues'
    ]
  };

  const capabilities = capabilitiesMap[type];

  if (!capabilities) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  return c.json({
    type,
    capabilities
  });
});

export default agentsRoute;

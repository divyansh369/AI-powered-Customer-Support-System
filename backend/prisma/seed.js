import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";
import pg from 'pg';

// 1. Setup the connection to your Docker Postgres
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with that adapter
const prisma = new PrismaClient({ adapter });


await prisma.order.createMany({
  data: [
    { id: 'ORD001', status: 'SHIPPED', userId: 'U1' },
    { id: 'ORD002', status: 'DELIVERED', userId: 'U1' }
  ]
})

await prisma.invoice.createMany({
  data: [
    { id: 'INV001', amount: 499, status: 'PAID', orderId: 'ORD001' }
  ]
})

await prisma.$disconnect()
console.log("Seeding completed....");
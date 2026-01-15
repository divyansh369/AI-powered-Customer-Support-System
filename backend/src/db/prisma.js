import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Setup the connection to your Docker Postgres
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with that adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
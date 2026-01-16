# 🤖 AI-Powered Customer Support System

![Multi-Agent Support](https://img.shields.io/badge/AI-Multi--Agent--System-blueviolet?style=for-the-badge&logo=openai)
![Tech Stack](https://img.shields.io/badge/Stack-Hono--React--Prisma-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)

A high-performance, full-stack customer support chat application featuring a specialized **Multi-Agent Architecture**. The system intelligently routes user queries to dedicated agents (Support, Order, or Billing) that interact with real-time database tools to provide accurate, context-aware assistance.

Live - [https://ai-powered-customer-support-system-nti6.onrender.com](https://ai-powered-customer-support-system.vercel.app/)
---

## 🚀 Key Features

### ✅ Multi-Agent Architecture
* **Intelligent Router:** Analyzes user intent and directs the chat to the correct specialized agent.
* **Support Agent:** Handles general inquiries, FAQs, and troubleshooting using conversation history.
* **Order Agent:** Tracks orders and delivery status using direct database tool calling.
* **Billing Agent:** Manages invoices and refund status through secure DB lookups.

### ✅ Agent Tools & Persistence
* **DB-Backed Tools:** Agents query real-time data (Orders, Invoices) from PostgreSQL using Prisma.
* **Conversation History:** Sessions are saved automatically; the sidebar allows switching between previous chats.
* **Real-time UX:** Integrated typing indicators show the agent's current stage (`Routing` → `Thinking` → `Fetching` → `Generating`).

### ✅ Production-Ready Guardrails
* **Rate Limiting:** Protects free-tier AI quotas with per-IP in-memory limiting on the chat endpoint.
* **Error Handling:** Gracefully handles LLM quota exceedances and server errors with user-friendly notifications.

---

## 🧱 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (JavaScript), Axios, Lucide Icons, Tailwind CSS |
| **Backend** | Hono (Node.js), Vercel AI SDK, Google Gemini |
| **Database** | PostgreSQL, Prisma ORM |
| **Environment** | Dotenv, Cross-env |

---

## 📁 Project Structure

```text
src/
├── agents/            # Multi-agent logic (Support, Order, Billing, Router)
├── routes/            # API Endpoints (Chat, Conversations, Agents)
├── tools/             # Database tools used by agents
├── middleware/        # Rate limiting and security middleware
├── utils/             # Error handlers and utility functions
├── db/                # Prisma client setup
└── prisma/            # Schema definition and seed scripts
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
git clone https://github.com/divyansh369/AI-powered-Customer-Support-System.git
cd AI-powered-Customer-Support-System
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/support_chat"

# AI Configuration (Vercel AI SDK)
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key_here"
```

### 3. Database Initialization

```bash
# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev --name init

# Seed Database with Mock Data
node prisma/seed.js
```

### 4. Run Locally

```bash
# Start Backend (Port 3000)
npm run dev

# Start Frontend (In a separate terminal)
cd frontend
npm install
npm run dev
```

---

## 🧪 API Endpoints

### Chat System
- **POST** `/api/chat/messages` - Main entry point. Accepts message and conversationId.

### Conversations
- **GET** `/api/conversations` - List all sessions.
- **GET** `/api/conversations/:id` - Retrieve message history for a session.
- **DELETE** `/api/conversations/:id` - Delete a specific session.

### Metadata
- **GET** `/api/agents` - Retrieve list of agents and their specific capabilities.
- **GET** `/api/health` - Check server and database status.

---

## 🚦 Rate Limiting

To ensure fair usage and protect API quotas, the following limits are applied:

- **Endpoint:** `POST /api/chat/messages`
- **Limit:** 10 requests per minute per IP.
- **Exceeded Response:** Returns `429 Too Many Requests` with a `Retry-After` header.

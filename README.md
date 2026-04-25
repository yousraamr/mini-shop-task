# 🛍️ Mini Shop Task

A full-stack **Mini Shop Ordering Platform** built with a modern multi-project architecture:

- 📱 **Mobile App** — Customer shopping experience built with **React Native + Expo**
- 🖥️ **Admin Dashboard** — Product & order management built with **React + Vite + TailwindCSS**
- ⚙️ **Backend API** — Secure REST API built with **Node.js + Fastify + Supabase**

Designed to demonstrate production-ready architecture, authentication flows, clean UI, scalable APIs, and real-world order management.

---

# 🚀 Live Project Structure

mini-shop-task/
│── mobile/       # Customer mobile app
│── dashboard/    # Admin dashboard
│── backend/      # REST API server

---

# ✨ Core Features

## 📱 Mobile App (Customer)

- 🔐 Register / Login / Logout
- 🛒 Browse Products
- 📂 Browse Categories
- ❤️ Add to Cart
- 💳 Checkout Flow
- 📦 Place Orders
- 📜 Order History
- 👤 Profile Page
- 🔑 Forgot Password

---

## 🖥️ Admin Dashboard

- 🔐 Admin Login
- 📊 KPI Dashboard
- 📦 Manage Products
- ➕ Create Products
- ✏️ Edit Products
- 🚫 Toggle Active / Inactive
- 📁 Category Management
- 🧾 View Orders
- 🔄 Update Order Status
- 📈 Revenue + Orders Metrics

---

## ⚙️ Backend API

- JWT Authentication
- Role-based Authorization
- Product CRUD
- Category CRUD
- Order Management
- Image Upload API
- Supabase Database Integration
- CORS Enabled
- Secure Environment Variables

---

# 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Mobile | React Native + Expo |
| Dashboard | React + Vite + TailwindCSS |
| Backend | Node.js + Fastify |
| Database | Supabase PostgreSQL |
| Auth | JWT |
| Styling | TailwindCSS |
| State | React Hooks / Context |

---

# 📦 Repository Setup

## 1️⃣ Clone Project

```bash
git clone https://github.com/yousraamr/mini-shop-task.git
cd mini-shop-task

# ⚙️ Environment Variables
Create the following .env files before running the project.
/backend/.env

```bash
PORT=5000
JWT_SECRET=your_super_secret_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

/dashboard/.env

```bash
VITE_API_URL=http://localhost:5000

/mobile/.env

```bash
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000

Replace YOUR_LOCAL_IP with your computer IP when testing on a real device.

# ▶️ Run the Backend

```bash
cd backend
npm install
npm run dev
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000

Server runs at:
```bash
http://localhost:5000

# ▶️ Run the Dashboard

```bash
cd dashboard
npm install
npm run dev

Dashboard runs at:
http://localhost:5173

# ▶️ Run the Mobile App
```bash
cd mobile
npm install
npx expo start

Then scan the QR code using Expo Go.

# 📡 Main API Endpoints

## Authentication

- `POST /auth/register`
- `POST /auth/login`

## Products

- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `PATCH /products/:id/toggle`

## Categories

- `GET /categories`
- `POST /categories`

## Orders

- `POST /orders`
- `GET /orders`
- `PATCH /orders/:id/status`

---

# 📱 Customer App Flow

1. Register a new account  
2. Login securely  
3. Browse products  
4. Add products to cart  
5. Checkout  
6. Place order  
7. Track previous orders  

---

# 🖥️ Admin Dashboard Flow

1. Login as admin  
2. Open KPI dashboard  
3. Manage products  
4. Upload product images  
5. Manage categories  
6. Review customer orders  
7. Update order status to:

- Pending  
- Processing  
- Delivered  
- Cancelled  

---

# 🧠 Technical Highlights

- Modular folder structure  
- Reusable UI components  
- RESTful API design  
- JWT protected routes  
- Role-based admin access  
- Responsive dashboard UI  
- Mobile-first shopping UX  
- Supabase cloud database integration  

---

# 📁 Sub-Projects

## 📱 `/mobile`

Customer-facing React Native app using Expo.

## 🖥️ `/dashboard`

Admin dashboard built with React + Vite.

## ⚙️ `/backend`

Fastify REST API connected to Supabase PostgreSQL.

---

# 👩‍💻 Author

**Yousra Amr**

- GitHub: https://github.com/yousraamr  
- LinkedIn: https://linkedin.com/in/yousra-amr-93a691279  
- Email: yousraamr000@gmail.com

Replace YOUR_LOCAL_IP with your computer IP when testing on a real device.



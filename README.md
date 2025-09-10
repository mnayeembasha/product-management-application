# 📦 Product Management Application

A full-stack **Product Management System** showcasing authentication, CRUD operations, caching, and media storage — built with **React + TypeScript, Node.js + Express, MongoDB, Redis, and Cloudinary**.

---

## 🚀 Tech Stack

**Frontend**

* React + TypeScript

**Backend**

* Node.js + Express
* Zod for input validation
* Bcrypt for password hashing
* JWT in HTTP-only cookies for authentication

**Database & Caching**

* MongoDB
* Redis for query caching and faster responses

**Image Storage**

* Cloudinary for product image hosting

---

## ✨ Features

* 🔐 **Authentication**

  * Secure signup & login (name, email, password)
  * Passwords hashed with bcrypt
  * JWT stored in **HTTP-only cookies** (mitigates XSS token theft)

* 🛍️ **Product Management**

  * View products (name, price, category, image)
  * Add products with Cloudinary image upload
  * Edit products (old Cloudinary image auto-deleted on update)
  * Delete products (removes image + clears Redis cache)

* 🔎 **Advanced Filtering**

  * Filter by category
  * Sort by price or date
  * Search by name or description
  * Cached in Redis for high performance

---

## 🛡️ Security Measures

* ✅ **NoSQL Injection Prevention** →

  * Using `mongoose` with parameterized queries
  * Sanitization with `express-mongo-sanitize`

* ✅ **Validation** →

  * Zod ensures request body conforms to schema before DB write

* ✅ **Authentication Security** →

  * JWT stored in HTTP-only cookie to prevent XSS token theft
  * Bcrypt password hashing

* ✅ **CORS Restrictions** →

  * Only frontend origin allowed

* ✅ **Error Handling** →

  * Centralized Express error middleware with proper status codes

---

## ⚡ Performance Optimizations

* 🗃 **Redis Caching**

  * Stores frequently accessed product queries
  * Cache invalidated on product create/update/delete


* 🖼 **Cloudinary Optimization**

  * Old product images auto-deleted on edit/delete
  * Reduced DB bloat + cost savings


---



## ⚡ API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | `/api/auth/signup`  | User registration |
| POST   | `/api/auth/login`   | User login        |
| GET    | `/api/products`     | Get all products  |
| POST   | `/api/products`     | Add new product   |
| PUT    | `/api/products/:id` | Edit product      |
| DELETE | `/api/products/:id` | Delete product    |

---




## 📦 Installation

1. Clone the repo

   ```bash
   git clone https://github.com/your-username/product-management-app.git
   cd product-management-app
   ```
2. Add environment variables(see .env.example)

   * `MONGO_URI`
   * `REDIS_URL`
   * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   * `JWT_SECRET`

3. Setup backend

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Setup frontend

   ```bash
   cd frontend
   npm install
   npm start
   ```



---


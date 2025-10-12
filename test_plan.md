# 🌿 Gardenly — Test Plan

This document describes the **validation** and **asynchronous (async) API test cases** executed for the Gardenly project.  
The goal of these tests is to ensure the correctness of both frontend and backend functionalities, focusing on data validation, API response handling, and async operations.

---

## 🧪 1. Overview

| Category | Description |
|-----------|--------------|
| **Project Name** | Gardenly |
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **Testing Tools** | Postman, Browser Console, Jest (optional manual testing) |
| **Test Type** | Functional, Validation, Asynchronous API Tests |

---

## ✅ 2. Validation Test Cases

| Test ID | Module | Test Description | Input | Expected Output | Actual Result | Status |
|----------|----------|------------------|--------|------------------|----------------|---------|
| V1 | Register | Check for empty name or email field | `{name: "M.Sai Teja", email: "saiteja.m23@iiits.in"}` | Should show validation error "All fields required" | Validation error displayed | ✅ Passed |
| V2 | Register | Check invalid email format | `email: "harsha.com"` | Should display "Invalid email format" | Error message displayed | ✅ Passed |
| V3 | Login | Check wrong credentials | `email: "x@y.com", password: "wrong123"` | Should display "Invalid credentials" | Error displayed | ✅ Passed |
| V4 | Seller | Validate missing price or product name | `{name: "hello", price: 300}` | Should show error "Product name required" | Validation message shown | ✅ Passed |
| V5 | Add to Cart | Validate quantity input | `quantity: -1` | Should restrict quantity to positive numbers | Restricted correctly | ✅ Passed |

---

## 🔄 3. Async / API Test Cases

| Test ID | Endpoint | Method | Description | Expected Response | Actual Result | Status |
|----------|-----------|--------|--------------|--------------------|----------------|---------|
| A1 | `/api/register` | POST | Register a new user | `201 Created`, JSON: `{ success: true }` | Returned success JSON | ✅ Passed |
| A2 | `/api/login` | POST | Authenticate user credentials | `200 OK`, JSON with JWT token | Token received | ✅ Passed |
| A3 | `/api/plants` | GET | Fetch all plant data | `200 OK`, array of plants | Data fetched successfully | ✅ Passed |
| A4 | `/api/seeds` | GET | Fetch seed products | `200 OK`, array of seeds | Data displayed correctly | ✅ Passed |
| A5 | `/api/seller` | POST | Upload seller product | `201 Created`, new product record in DB | Product stored in DB | ✅ Passed |
| A6 | `/api/cart` | POST | Add product to cart | `201 Created`, JSON success response | Added successfully | ✅ Passed |
| A7 | `/api/orders` | GET | Retrieve user orders | `200 OK`, array of order objects | Orders retrieved | ✅ Passed |

---

## 🧠 4. Asynchronous Call Verification

- Verified using **Chrome DevTools → Network tab** and **Postman**.
- Each async operation uses:
  ```js
  const res = await fetch("/api/plants");
  const data = await res.json();

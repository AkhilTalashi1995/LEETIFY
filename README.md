# Leetify

Leetify is a modern, full-stack coding practice and interview preparation platform.  
It helps students and professionals enhance their coding skills, track progress, and prepare for technical interviews—while providing premium features, progress tracking, and Stripe-based subscriptions.

---

## 🛠 Tech Stack

- **Frontend**: React, Redux, SCSS
- **Backend**: Node.js, Express, MongoDB (Mongoose), Stripe, AWS EC2
- **Authentication**: JWT, bcrypt

---

## 🚀 Features

- **User Authentication** (Sign up, Login, JWT-protected routes)
- **Problem Bank**: Browse, filter, and solve coding problems of varying difficulty
- **Code Editor & Judge**: Write code in-browser, run against test cases, get instant feedback
- **Submission History**: Track accepted/wrong/running code, see previous attempts
- **Premium Access**: Unlock premium/locked problems via Stripe subscription (monthly/yearly)
- **Admin Panel**: Manage problems, view user data (admin-only)
- **Responsive UI**: Works across devices and browsers


**Live: https://leetify.vercel.app/**

**Youtube: [Watch Here](https://www.youtube.com/watch?v=UlsqZqGAG1Q)**

## ⚡ Quick Start

1. **Clone the Repository**
    ```bash
    git clone https://github.com/AkhilTalashi1995/LEETIFY.git
    ```

2. **Setup Environment Variables** (see below)

3. **Run Backend**
    ```bash
    cd back-end
    npm install
    npm start
    ```
    Server runs at `http://localhost:8000`

4. **Run Frontend**
    ```bash
    cd front-end
    npm install
    npm start
    ```
    Client runs at `http://localhost:3000`

---

## 🗝️ Environment Variables

To run Leetify locally, you need two `.env` files: one for backend, one for frontend.

<details>
<summary><b>Backend <code>back-end/.env</code></b></summary>

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

</details> 

<details> <summary><b>Frontend <code>front-end/.env</code></b></summary>

REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-publishable-key
</details> ```


## 🖼️ Preview
![Digital Life Lessons Screenshot](https://i.ibb.co.com/wZvRfChv/digital-life-lessons.png)
<!-- Replace the image above with a real homepage screenshot, e.g. hosted on ibb.co like your other project images -->

---

## 🎯 Project Goals

* Let people **create, preserve, and share** meaningful life lessons
* Support **public and premium content** with clear access control
* Provide **secure authentication** for personal accounts
* Enable a **Stripe-powered premium subscription** for exclusive content
* Deliver a **clean, fast, mobile-first** reading experience

---

## 🧱 Tech Stack

**Frontend**
* ⚛️ Next.js 16 (App Router) + React 19
* 🎨 Tailwind CSS 4
* 🧩 HeroUI component library (`@heroui/react`, `@heroui/styles`)
* 🎬 Framer Motion (animations)
* 🌗 next-themes (dark / light mode)
* 🔔 React Hot Toast (notifications)
* 🎠 Swiper + React Fast Marquee (carousels & featured content)
* 🧠 date-fns, clsx, tailwind-merge (utilities)

**Backend**
* 🟢 Node.js + Express 5
* 🍃 MongoDB (native driver)
* 🌐 CORS
* 🔐 dotenv (environment config)

**Auth & Payments**
* 🔑 Better Auth + `@better-auth/mongo-adapter` (authentication)
* 💳 Stripe + `@stripe/stripe-js` (premium subscription checkout)

---

## ✨ Key Features

### 🔐 Authentication
* Secure sign-up/sign-in powered by Better Auth
* MongoDB-backed session and user storage

### 💎 Premium Access Control
* Public lessons available to everyone
* Premium lessons gated behind Stripe checkout
* Subscription-based unlock flow

### 🌗 Theming & UX
* Dark/light mode toggle via next-themes
* Toast notifications for actions (save, unlock, errors)
* Smooth Framer Motion transitions throughout

### 🎠 Content Discovery
* Swiper-based carousels for featured lessons
* Marquee strip for trending/highlighted content

---

## 📱 Responsive Design

* Mobile-first Tailwind layout
* Works smoothly across phone, tablet, and desktop
* HeroUI components adapt to screen size out of the box

---

## 🧠 UX Strategy

User Flow:
```
Discover Lesson → Read Free Preview → Prompted to Unlock Premium → Stripe Checkout → Full Access
```

✔ Clear free-vs-premium boundary
✔ Low-friction checkout via Stripe
✔ Consistent theming across light/dark modes

---

## 📦 Project Structure

```
client/ (Next.js)
 ├── app/
 │   ├── (routes)/
 │   ├── layout.jsx
 │   └── page.jsx
 ├── components/
 │   ├── Navbar.jsx
 │   ├── LessonCard.jsx
 │   ├── PremiumGate.jsx
 │   └── Footer.jsx
 ├── lib/
 │   ├── auth.js         # Better Auth config
 │   └── stripe.js        # Stripe client setup
 └── public/

server/ (Express)
 ├── index.js
 ├── routes/
 │   ├── lessons.js
 │   └── payments.js
 └── config/
     └── db.js            # MongoDB connection
```
<!-- Adjust this tree to match your real folder layout -->

---

## ⚡ Highlights

* 🔐 Full authentication flow with Better Auth
* 💳 Real Stripe checkout integration for premium content
* 🌗 Dark/light theme support
* 🧩 Built on Next.js 16 + React 19 (latest stable stack)
* 🍃 Custom Express + MongoDB backend (not a BaaS)

---

## 🛠️ Installation

This project has two parts — client and server — and both need to run for the app to work fully.

**1. Clone both repos**
```bash
git clone https://github.com/shakilcreativework/digital-life-lessons-client.git
git clone https://github.com/shakilcreativework/digital-life-lessons-server.git
```
<!-- Verify these are your exact repo names/URLs before publishing -->

**2. Set up the server**
```bash
cd digital-life-lessons-server
npm install
```

Create a `.env` file in the server folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Run it:
```bash
npm start
```

**3. Set up the client**
```bash
cd digital-life-lessons-client
npm install
```

Create a `.env.local` file in the client folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Run it:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

<!-- These env variable names are based on what your dependencies typically require — double check against your actual .env before publishing, and never commit real secrets to the README or repo. -->

---

## 📌 Future Improvements

* 🔍 Search and filtering across lessons
* ❤️ Save/bookmark favorite lessons
* 📊 Analytics on lesson engagement
* 📱 Progressive Web App (PWA) support
* 🌍 Multi-language content support

---

## 🤝 Connect With Me

* 💼 LinkedIn: [profile](https://www.linkedin.com/in/shakilcreativework)
* 🐙 GitHub: [profile](https://github.com/shakilcreativework)

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

### ⚡ Built with passion for creators & lifelong learners

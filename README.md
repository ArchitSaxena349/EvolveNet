
---

# ⚡ EvolveNet

*A full-stack professional networking platform built with the MERN stack.*

---

## 🌐 Overview

**EvolveNet** is a modern, full-featured professional networking platform designed to empower users to:

* Build and manage professional profiles
* Connect with peers and industry experts
* Join communities and interest groups
* Create, promote, and attend professional events

Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), EvolveNet provides a seamless, secure, and scalable experience—ideal for anyone looking to expand their professional presence.

---

## 🚀 Features

### 👤 User Authentication

* Secure sign-up and login flow using **JWT**
* **Email verification** via **Nodemailer**
* Refresh tokens for persistent sessions

### 📝 Profile Management

* Create, view, and edit detailed professional profiles

### 🤝 Connections

* Send and accept connection requests
* View mutual connections and grow your network

### 🌍 Communities

* Create and join **groups** based on shared interests or industries
* Foster discussion and collaboration with peers

### 📅 Event Management

* Organize and promote professional events
* RSVP and view upcoming or past events

---

## 🛡️ Security Highlights

EvolveNet is designed with strong security principles:

* **JWT & Refresh Tokens** for secure session management
* **Bcrypt** hashing for all passwords
* **Rate Limiting** to prevent brute-force attacks
* **CORS** properly configured
* **Helmet.js** to set secure HTTP headers

---

## 🧱 Tech Stack

### Frontend

* React.js
* Axios
* React Router
* Tailwind CSS (if you're using it—optional to list)

### Backend

* Node.js
* Express.js
* MongoDB (via Mongoose)

### Libraries & Utilities

* `bcrypt` – Password hashing
* `jsonwebtoken` – JWT-based auth
* `nodemailer` – Email verification
* `helmet` – Secure HTTP headers
* `cors` – Enable cross-origin requests
* `dotenv` – Environment variable management

---

## ⚙️ Installation

Clone the repo:

```bash
git clone https://github.com/ArchitSaxena349/EvolveNet.git
cd EvolveNet
```

Install backend and frontend dependencies:

```bash
npm install
```

Set up environment variables:

Create a `.env` file in the root directory and define the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
EMAIL_SERVICE=your_email_service_provider (e.g. Gmail)
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
EMAIL_FROM="Your App <no-reply@example.com>"
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Running the App

### Development Mode (with Hot Reloading)

```bash
npm run dev
```

### Cleaning and organizing assets

The repo includes helper scripts to clean temporary files and consolidate frontend assets:

- Run the cleaner (removes debug logs and .DS_Store files):

```bash
npm run clean
```

- To consolidate image assets into `client/public/assets/` and update client references run:

```bash
node scripts/organize-assets.js
```

The `organize-assets` script moves files from `logo/` and `client/public/` into `client/public/assets/` and updates `index.html` and `manifest.json` accordingly. The script makes backups of overwritten files with `.bak` suffix.


### Production Mode

```bash
# Build the React client
npm run build

# Start the backend server
npm start
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, fork, or contribute 🤝

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
Let's build something impactful together!

---

## 🙌 Acknowledgements

Thanks to all open-source contributors and tools that made this project possible!

---

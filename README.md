<div align="center">

# 🚍 TransitOps
### Intelligent Fleet Operations Platform

<p align="center">
A modern, scalable Fleet Management System built with the MERN Stack to streamline transportation operations through secure authentication, real-time dashboards, and end-to-end fleet management.
</p>

<p align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/Hari-preetham-B/TransitOps?style=for-the-badge)

![GitHub last commit](https://img.shields.io/github/last-commit/Hari-preetham-B/TransitOps?style=for-the-badge)

![GitHub stars](https://img.shields.io/github/stars/Hari-preetham-B/TransitOps?style=for-the-badge)

![GitHub forks](https://img.shields.io/github/forks/Hari-preetham-B/TransitOps?style=for-the-badge)

![License](https://img.shields.io/github/license/Hari-preetham-B/TransitOps?style=for-the-badge)

</p>

<p align="center">

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=600&size=24&duration=3000&pause=1000&center=true&vCenter=true&width=700&lines=Fleet+Management+Platform;MERN+Stack+Application;Role-Based+Access+Control;Analytics+Dashboard;Vehicle+%7C+Driver+%7C+Trip+Management" />

</p>

---

</div>

# 📖 Overview

**TransitOps** is a full-stack Fleet Management and Transport Operations Platform built using the **MERN Stack**.

The platform enables organizations to efficiently manage:

- 🚚 Fleet Vehicles
- 👨‍✈️ Drivers
- 🛣 Trips
- 🛠 Maintenance
- 📊 Operational Analytics

TransitOps combines secure authentication, modular architecture, responsive UI, and real-time dashboard analytics into a single modern web application.

---

# ✨ Key Features

### 🔐 Authentication & Security

- JWT Authentication
- HTTP-only Cookie Sessions
- Role-Based Access Control (RBAC)
- Protected Routes
- Secure REST APIs

---

### 📊 Dashboard

- Fleet Overview
- Active Vehicles
- Available Vehicles
- Trips Overview
- Maintenance Summary
- Fleet Utilization
- Dynamic Filters
- Analytics Charts

---

### 🚚 Vehicle Management

- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Vehicle Search
- Vehicle Filters
- Pagination

---

### 👨‍✈️ Driver Management

- Driver CRUD
- Driver Status
- Driver Assignment
- Availability Tracking

---

### 🛣 Trip Management

- Trip Creation
- Driver Assignment
- Vehicle Assignment
- Route Tracking
- Trip Status Management

---

### 🛠 Maintenance

- Schedule Maintenance
- Update Status
- Maintenance History
- Vehicle Availability

---

### 📈 Reports & Analytics

- Fleet Utilization
- Vehicle Statistics
- Trip Statistics
- Dashboard Insights
- Operational Metrics

---

# 🏗 System Architecture

```text
                React + Vite
                      │
          ┌───────────┴───────────┐
          │                       │
 Authentication             Dashboard
          │                       │
          └───────────┬───────────┘
                      │
               Express REST API
                      │
      ┌───────────────┼────────────────┐
      │               │                │
  Vehicle API     Driver API      Trip API
      │               │                │
      └───────────────┼────────────────┘
                      │
               Maintenance API
                      │
                  MongoDB Atlas
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Toastify
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookie Parser
- bcrypt
- dotenv

---

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```text
TransitOps
│
├── frontend
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── routes
│   ├── services
│   ├── hooks
│   └── context
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── config
│   └── utils
│
└── README.md
```

---

# 🚀 Current Features

| Module | Status |
|---------|:------:|
| Landing Page | ✅ |
| Authentication | ✅ |
| JWT Security | ✅ |
| Dashboard | ✅ |
| Dashboard Filters | ✅ |
| Dashboard Statistics | ✅ |
| Recent Trips | ✅ |
| Vehicle CRUD | 🚧 |
| Driver CRUD | 🚧 |
| Trip CRUD | 🚧 |
| Maintenance CRUD | 🚧 |
| Reports | ⏳ |

---

# 🗺 Roadmap

### Phase 1

- [x] Authentication
- [x] Landing Page
- [x] Dashboard
- [x] Dashboard Filters
- [x] Analytics Cards

### Phase 2

- [ ] Vehicle Management
- [ ] Driver Management
- [ ] Trip Management
- [ ] Maintenance Module

### Phase 3

- [ ] Live Analytics
- [ ] Reports
- [ ] Export Data
- [ ] Notifications
- [ ] Performance Optimization

---

# ⚡ Getting Started

## Clone Repository

```bash
git clone https://github.com/Hari-preetham-B/TransitOps.git
```

## Install Frontend

```bash
cd frontend
npm install
npm run dev
```

## Install Backend

```bash
cd backend
npm install
npm run dev
```

---

# 🔑 Environment Variables

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret

CLIENT_URL=http://localhost:5173
```

---

# 📸 Screenshots

```text
📷 Landing Page

📷 Login

📷 Dashboard

📷 Vehicle Management

📷 Driver Management

📷 Trip Management

📷 Maintenance
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ using the MERN Stack.

</div>

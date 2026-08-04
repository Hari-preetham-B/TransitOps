<div align="center">

# 🚚 TransitOps
### Smart Transport Operations Platform

[![License](https://img.shields.io/badge/license-MIT-yellow)](#-license)
[![Status](https://img.shields.io/badge/status-Fully%20Operational-brightgreen)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)]()
[![Express](https://img.shields.io/badge/express-5-black?logo=express&logoColor=white)]()
[![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)]()
[![MongoDB](https://img.shields.io/badge/mongodb-%2B%20mongoose-47A248?logo=mongodb&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)]()

**TransitOps is a full-stack transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management** — replacing spreadsheets and manual logbooks with one live, role-based system that enforces business rules automatically.

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [The 5 Modules](#-the-5-modules)
- [Business Workflow](#-business-workflow)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Role & Permission Matrix](#-role--permission-matrix)
- [Business Rules Enforced](#-business-rules-enforced)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🌍 Overview

Most logistics teams still run their fleet on spreadsheets and paper logbooks — leading to double-booked vehicles, missed maintenance, expired driver licenses, and no real visibility into cost or performance.

**TransitOps fixes that by unifying:**

- 🚐 **Fleet** — vehicle registry, live status, lifecycle tracking
- 🧑‍✈️ **Drivers** — profiles, license compliance, safety scores
- 📦 **Dispatch** — trip creation, validation, and lifecycle automation
- 🔧 **Maintenance** — service logs with automatic fleet status sync
- ⛽ **Finance** — fuel logs, expenses, operational cost & ROI reporting

...into a single role-based dashboard, with live KPIs computed straight from operational data.

---

## 🧩 The 5 Modules

<details open>
<summary><b>📋 Phase 1 — Authentication, RBAC & Core Data Model</b></summary>

- Secure email/password authentication with JWT (httpOnly cookies)
- Role-Based Access Control across 4 roles: **Fleet Manager, Driver, Safety Officer, Financial Analyst**
- Vehicle & Driver registries with strict uniqueness (registration number, license number)
- Status lifecycles enforced at the schema and service layer

</details>

<details open>
<summary><b>🚦 Phase 2 — Trip Management</b></summary>

- Trip lifecycle: `Draft → Dispatched → Completed → Cancelled`
- Cargo weight validated against vehicle max load capacity
- Vehicle/driver availability, license expiry, and suspension checks enforced before dispatch
- Dispatch/Complete/Cancel automatically syncs vehicle & driver status

</details>

<details open>
<summary><b>🔧 Phase 3 — Maintenance</b></summary>

- Create/close maintenance records per vehicle
- Active maintenance automatically switches a vehicle to **In Shop**, removing it from dispatch
- Closing maintenance restores the vehicle to **Available** (unless Retired)

</details>

<details open>
<summary><b>🛡️ Phase 4 — Role-Based Access Control</b></summary>

- Backend permission matrix middleware guarding every route by resource + action
- Frontend UI mirrors backend permissions — write actions are hidden/disabled per role, not just blocked server-side

</details>

<details open>
<summary><b>⛽ Phase 5 — Fuel, Expenses & Reports</b></summary>

- Fuel log & expense tracking per vehicle
- Auto-computed operational cost (Fuel + Maintenance) per vehicle
- Reports: Fuel Efficiency, Fleet Utilization, Operational Cost, Estimated ROI
- CSV export for all report types

</details>

---

## 🔄 Business Workflow

```
Register Vehicle ──▶ Register Driver ──▶ Create Trip (Draft)
                                               │
                                               ▼
                                    Validate: capacity, license,
                                    status, availability
                                               │
                                               ▼
                                     Dispatch ──▶ vehicle & driver
                                                  set to "On Trip"
                                               │
                              ┌────────────────┼────────────────┐
                              ▼                                 ▼
                        Complete Trip                     Cancel Trip
                   (log odometer + fuel)              (restore availability)
                              │
                              ▼
                  Vehicle & Driver → Available
                              │
                              ▼
                Maintenance record (optional) ──▶ vehicle → "In Shop"
                              │
                              ▼
              Reports auto-update: cost, efficiency, utilization, ROI
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, Recharts, React Hook Form + Zod, Axios |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB) |
| **Auth** | JWT (httpOnly cookies), bcrypt password hashing |
| **Validation** | express-validator (backend), Zod (frontend) |
| **Docs** | Swagger / OpenAPI at `/api-docs` |
| **Tooling** | Vite, ESLint |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Hari-preetham-B/TransitOps.git
cd TransitOps
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your values — see below
npm run dev
```
Backend runs on `http://localhost:5000` · Swagger docs at `http://localhost:5000/api-docs`

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. (Optional) Migrate legacy status values
If you're seeding from older test data with outdated status enums:
```bash
cd backend
node scripts/migrateStatuses.js
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transitops
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 👥 Role & Permission Matrix

| Resource | Read Access | Write Access |
|---|---|---|
| **Vehicles** | All roles | Fleet Manager |
| **Drivers** | All roles | Fleet Manager, Safety Officer |
| **Trips** | All roles | Fleet Manager, Driver |
| **Maintenance** | All roles | Fleet Manager |
| **Fuel Logs** | All roles | Financial Analyst |
| **Expenses** | All roles | Financial Analyst |
| **Reports** | All roles | Financial Analyst |

Enforced identically on the backend (`authorizeMiddleware`) and mirrored in the frontend UI, so restricted actions are hidden — not just blocked.

---

## ✅ Business Rules Enforced

- 🔒 Vehicle registration numbers and driver license numbers must be unique
- 🚫 Retired or In Shop vehicles never appear in dispatch selection
- 🚫 Suspended drivers or drivers with expired licenses cannot be assigned to trips
- 🚫 A vehicle or driver already **On Trip** cannot be assigned to another trip
- ⚖️ Cargo weight cannot exceed a vehicle's maximum load capacity
- 🔁 Dispatch → both vehicle & driver set to **On Trip**
- 🔁 Complete / Cancel → both restored to **Available**
- 🔧 Active maintenance → vehicle set to **In Shop**; closing restores it (unless Retired)
- 💰 Operational cost = Fuel + Maintenance, computed automatically per vehicle

---

## 📁 Project Structure

```
TransitOps/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic & rule enforcement
│   ├── models/           # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── middleware/       # Auth, RBAC, error handling
│   ├── validators/       # Request validation
│   ├── scripts/          # One-off/migration scripts
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/         # Dashboard, Vehicles, Drivers, Trips, Maintenance, Fuel & Expenses, Reports
│       ├── layouts/       # App shell & sidebar navigation
│       ├── context/       # Auth context
│       └── services/      # API layer
└── README.md
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

</div>
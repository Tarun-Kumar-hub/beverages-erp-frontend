# Beverage ERP System - Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)
![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, responsive **Enterprise Resource Planning (ERP)** frontend developed for beverage manufacturing companies to streamline inventory management, production workflows, packaging, customer management, and order processing.

Built with **React.js**, **Vite**, **Redux Toolkit**, and **TanStack Query**, the application delivers a fast, responsive user experience with secure authentication, role-based access control, real-time analytics, and seamless integration with a RESTful backend API.
---
## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [Deployment](#-deployment)
- [Application Preview](#-application-preview)
- [Highlights](#-highlights)
- [Production Features](#-production-features)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Environment Variables](#️-environment-variables)
- [Installation](#-installation)
- [Available Scripts](#-available-scripts)
- [Responsive Design](#-responsive-design)
- [Future Enhancements](#-future-enhancements)
- [Related Repository](#-related-repository)
- [Author](#-author)
- [Support](#-support)
---


## 🌐 Live Demo

**Frontend:** https://beverages-erp-frontend.vercel.app/

**Backend Repository:**  
https://github.com/Tarun-Kumar-hub/beverages-erp-backend

---
## 🚀 Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |
---
# 📸 Application Preview

Explore the key modules of the **Beverage ERP System**.

| 🔐 Login | 📊 Dashboard |
|:---------:|:------------:|
| ![Login](https://github.com/user-attachments/assets/88f40701-2ceb-4554-a729-e36ae4548641) | ![Dashboard](https://github.com/user-attachments/assets/bea2c8a3-4b9c-4d4d-ab22-3cb3268bc4f8) |

| 📦 Raw Materials | 🧪 Recipes |
|:----------------:|:----------:|
| ![Raw Materials](https://github.com/user-attachments/assets/508d7285-a9cc-489e-8a2a-13b81d98be08) | ![Recipes](https://github.com/user-attachments/assets/3475b349-950c-45ff-a3e8-8abfe49241ab) |

| 🛢 Containers | 📦 Product Stock |
|:-------------:|:----------------:|
| ![Containers](https://github.com/user-attachments/assets/070a695b-464b-479c-8338-bb0b6062b05a) | ![Product Stock](https://github.com/user-attachments/assets/959cd8b5-3c2c-4593-a609-057c931bc86b) |

| 🛒 Create Order | 📋 Orders |
|:---------------:|:---------:|
| ![Create Order](https://github.com/user-attachments/assets/d389cd40-555f-4cd3-ace1-fbb83be17c54) | ![Orders](https://github.com/user-attachments/assets/e3d25a1f-d06e-462c-94c2-8cc0dda39b4c) |

| 👥 Customers | 📜 Inventory History |
|:------------:|:--------------------:|
| ![Customers](https://github.com/user-attachments/assets/4d6719e2-144c-449c-bf27-f881829794dd) | ![Inventory History](https://github.com/user-attachments/assets/19c73f80-5a3a-401e-9080-af0000d12aab) |
---

# ✨ Highlights

- Enterprise ERP Dashboard
- JWT Authentication
- Role-Based Access Control (RBAC)
- TanStack Query for Server State Management
- Redux Toolkit for Authentication State
- REST API Integration
- Responsive Design
- Search, Filtering & Pagination
- Reusable Component Architecture
- Interactive Charts & Analytics

---
# 💡 Production Features

- 🔐 JWT Authentication & Authorization
- 👤 Role-Based Access Control (RBAC)
- 🔄 Automatic Access Token Refresh
- 🌐 Axios Interceptors for API Requests
- ⚡ TanStack Query Caching & Server State Management
- 📄 Server-side Pagination
- 🔍 Search & Filtering
- 📱 Fully Responsive Design
- 🔔 Toast Notifications
- 🧩 Reusable Component Architecture
---
# 🚀 Features

| Module | Features |
|---------|----------|
| 🔐 Authentication | Login, Registration, Email Verification, JWT Authentication, Protected Routes, RBAC |
| 📊 Dashboard | Business KPIs, Sales Analytics, Low Stock Alerts, Recent Activities, Top Products |
| 📦 Inventory | Raw Material Management, Inventory History, Stock Tracking, Search & Filtering |
| 🧪 Recipes | Recipe Management, Ingredient Mapping, Recipe Updates |
| 🛢 Containers | Container CRUD, Capacity Management, Status Tracking |
| 📦 Packaging | Packaging Inventory & Stock Management |
| 👥 Customers | Customer CRUD Operations & Search |
| 🛒 Orders | Create Orders, Order Tracking, Status Updates |
| 💻 User Experience | Responsive UI, Toast Notifications, Loading States, Error Handling, Pagination |

---

# 🛠 Tech Stack

### Frontend Framework
- React.js
- Vite

### Styling
- Tailwind CSS

### State Management
- Redux Toolkit
- TanStack Query

### Routing
- React Router DOM

### API Communication
- Axios

### UI Components
- React Select
- Lucide React
- React Hot Toast

---

# 🏗 Architecture

```
                    Frontend
        React.js + Vite + Tailwind CSS
                    │
     Redux Toolkit + TanStack Query
                    │
           Axios API Client
                    │
             RESTful API
                    │
          Node.js + Express.js
                    │
                PostgreSQL
```

---

# 📂 Project Structure

```
src
├── api              # API services
├── app              # Redux store
├── components       # Reusable UI components
├── constants        # Constants
├── features         # Redux slices
├── guards           # Protected routes
├── hooks            # Custom hooks
├── lib              # Helper libraries
├── pages            # Application pages
├── services         # Authentication & Token services
└── utils            # Utility functions
```

---

# 🔒 Authentication

The frontend implements a secure authentication flow using:

- JWT Access Tokens
- Refresh Tokens
- Axios Interceptors
- Protected Routes
- Role-Based Route Protection
- Automatic Token Refresh
- Persistent Login Sessions

---

# 🌐 API Integration

The frontend communicates with a RESTful backend built using:

- Node.js
- Express.js
- PostgreSQL

Backend Repository:

**https://github.com/Tarun-Kumar-hub/beverages-erp-backend**

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Tarun-Kumar-hub/beverages-erp-frontend.git

# Navigate to the project
cd beverages-erp-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
---

# 📜 Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

---

# 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 📌 Future Enhancements

- 🌙 Dark Mode
- 🌍 Multi-language Support
- 🔔 Real-time Notifications
- 📈 Advanced Analytics Dashboard
- 📄 PDF & Excel Report Export
- 📱 Progressive Web App (PWA) Support
- 📊 Advanced Business Reports

---

# 🔗 Related Repository

### Backend Repository

https://github.com/Tarun-Kumar-hub/beverages-erp-backend

---
## 👨‍💻 Author

**Tarun Kumar**

- **GitHub:** [Tarun-Kumar-hub](https://github.com/Tarun-Kumar-hub)
- **LinkedIn:** [Tarun Kumar](https://www.linkedin.com/in/tarun-kumar-042288144/)
---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

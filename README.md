# SpendWise — Personal Expense Tracker

A modern, full-stack web application designed to help users record everyday expenses, monitor financial habits, and quickly understand where their money goes.

Built with a **React.js** frontend, a **Java Spring Boot REST API** backend, and **persistent database storage**. Designed with clean separation of concerns and production deployment ready for **Vercel** (Frontend) and **Render** (Backend).

---

## 🚀 Key Features

- **Add Expense**: Record title, amount, category (*Food, Travel, Shopping, Other, Utilities, Entertainment, Health*), transaction date, and optional notes.
- **Strict Validation**: Rejects empty titles and non-positive amounts ($\le 0$) with actionable error messages both client-side and server-side.
- **Clear List & Table Views**: Display all saved expenses with color-coded category badges, dates, amounts, and note previews. Supports both structured Table View and responsive Card Grid view.
- **Edit & Delete Records**: Effortlessly edit details of any existing expense or remove erroneous records with a safety confirmation dialog.
- **Total Spending & Analytics**: Dynamic KPI cards displaying:
  - **Total Amount Spent** across all recorded expenses.
  - **Total Number of Transactions**.
  - **Top Spending Category** with percentage share.
  - **Average Expense per Transaction**.
- **Category Breakdown**: Interactive visual progress bars showing percentage distribution and subtotal per category. Clicking any category applies an instant filter.
- **Filter & Search**:
  - Filter list by category tabs (*All, Food, Travel, Shopping, Other, etc.*).
  - Instant search filter by title, notes, or category keyword.
  - Multi-criteria sorting (Date: Newest/Oldest, Amount: High/Low, Title: A-Z).
- **Persistent Data**: File-based H2 database (`./data/expensedb`) ensures records remain fully available after browser refreshes and application restarts. Also supports PostgreSQL on Render via environment variables.
- **Currency Flexibility**: Switch between `$ USD`, `₹ INR`, `€ EUR`, and `£ GBP` on the fly.
- **Live Backend Health Indicator**: Real-time ping status pill in the navbar.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Lucide React Icons |
| **Backend** | Java 21 / 23, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Bean Validation |
| **Database** | Embedded File-Persistent H2 (`./data/expensedb`), PostgreSQL Driver (Render compatible) |
| **Build Tools** | Maven 3.9 (with `mvnw` wrapper included) & npm / Vite |
| **Deployment Targets** | **Vercel** (Frontend SPA) & **Render** (Backend Web Service / Docker) |

---

## 📁 Repository Structure

```text
expense-tracker/
├── frontend/                     # React.js application
│   ├── src/
│   │   ├── components/           # Navbar, StatCards, CategoryBreakdown,
│   │   │                         # FilterBar, ExpenseTable, ExpenseCardGrid,
│   │   │                         # ExpenseModal, DeleteModal, Toast
│   │   ├── services/
│   │   │   └── api.js            # Unified REST client with error normalization
│   │   ├── utils/
│   │   │   └── categories.js     # Category badges, colors, and currency helpers
│   │   ├── App.jsx               # Main state coordinator & UI layout
│   │   ├── index.css             # Tailwind base & smooth animations
│   │   └── main.jsx
│   ├── .env.example              # Sample environment configuration
│   ├── .env.production           # Production template
│   ├── vercel.json               # Vercel SPA routing rewrite rules
│   ├── vite.config.js            # Dev proxy config (/api -> http://localhost:8080)
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # Java Spring Boot REST API
│   ├── src/main/java/com/expensetracker/
│   │   ├── controller/           # ExpenseController (/api/expenses), HealthController
│   │   ├── service/              # ExpenseService (business logic & analytics)
│   │   ├── repository/           # ExpenseRepository (Spring Data JPA queries)
│   │   ├── model/                # Expense entity, Category enum
│   │   ├── dto/                  # Request, Response, Summary, API wrapper DTOs
│   │   ├── exception/            # GlobalExceptionHandler, ResourceNotFoundException
│   │   └── config/               # CorsConfig, DataInitializer (sample seed)
│   ├── src/main/resources/
│   │   ├── application.properties # H2 file persistence & server port
│   │   └── application-prod.properties
│   ├── src/test/java/            # Integration & WebMvc unit tests (13 test cases)
│   ├── Dockerfile                # Multi-stage production container build
│   ├── render.yaml               # Render Blueprint definition
│   ├── mvnw / mvnw.cmd           # Cross-platform Maven Wrapper
│   └── pom.xml                   # Maven dependencies
│
└── README.md                     # Comprehensive project documentation
```

---

## ⚡ Running Locally

### Prerequisites
- **Java 17+** (Java 21 recommended)
- **Node.js 18+** & **npm**

### Step 1: Start the Backend (Spring Boot)
Open a terminal in the `backend/` directory:

```bash
cd backend

# On Linux / macOS:
./mvnw clean spring-boot:run

# On Windows:
.\mvnw.cmd clean spring-boot:run
```

The Spring Boot REST API will start at:
- **API Base URL**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/api/health`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/expensedb`
  - User: `sa`
  - Password: *(leave blank)*

> Note: On first run, the database automatically populates a few sample expenses so you can immediately interact with the analytics.

### Step 2: Start the Frontend (React + Vite)
Open a separate terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.
Vite is preconfigured to proxy all `/api` calls to `http://localhost:8080`.

---

## 🌐 Complete Deployment Guide (Aiven DB + Render + Vercel)

Follow this 3-step guide to take the full application live on the web:

```text
[React Frontend on Vercel] ──(REST /api)──> [Spring Boot on Render] ──(SSL)──> [Aiven Cloud Database]
```

---

### Step 1: Set Up Cloud Database on Aiven (Free Tier)

1. Sign up or log in at **[Aiven.io](https://aiven.io)**.
2. Click **"Create Service"**.
3. Select **PostgreSQL** (or MySQL).
4. Choose the **Free Plan** (available in supported regions like AWS us-east-1 or GCP).
5. Name your service (e.g. `expense-tracker-db`) and click **"Create Service"**.
6. Once the service is running, find the **Overview** tab:
   - Look for **Service URI**: It looks like:
     ```text
     postgres://avnadmin:AVNS_xxxxxx@pg-xxxx-project.aivencloud.com:12345/defaultdb?sslmode=require
     ```
   - **Copy this Service URI**. Our Spring Boot backend has built-in smart parsing that automatically detects and converts this URI directly!

---

### Step 2: Deploy Backend on Render

1. Push your repository to **GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to **[Render.com](https://render.com)**.
3. Click **"New +"** and select **"Web Service"**.
4. Connect your GitHub repository.
5. Fill in the service configuration:
   - **Name**: `expense-tracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/expense-tracker-backend-1.0.0.jar`
   - **Health Check Path**: `/api/health`
6. Scroll down to **Environment Variables** and add:
   - **`JAVA_VERSION`**: `21`
   - **`DATABASE_URL`**: Paste your **Aiven Service URI** from Step 1:
     ```text
     postgres://avnadmin:<password>@<host>:<port>/defaultdb?sslmode=require
     ```
7. Click **"Create Web Service"**.
8. Wait for the build to complete. Once live, Render will give you a public URL (e.g. `https://expense-tracker-backend-xxxx.onrender.com`).
9. Test it by opening `https://<your-render-url>/api/health` in your browser. You should see `{"status":"UP"}`!

---

### Step 3: Deploy Frontend on Vercel

1. Log in to **[Vercel.com](https://vercel.com)**.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-backend-url>/api` *(using your Render backend URL from Step 2)*
6. Click **"Deploy"**.
7. Vercel will build and assign you a live domain (e.g. `https://expense-tracker-frontend-xxxx.vercel.app`).

---

### 🔄 Verifying the Full End-to-End Flow

1. Open your Vercel URL in your browser.
2. The navbar will show a green **"API Connected"** badge.
3. Add a new expense (e.g. "Dinner with Team", $65.00, "Food").
4. Check your Aiven console: The record is immediately stored in your cloud database table `expenses`!
5. Refresh the page or close your browser: All expenses and analytics remain permanently saved.

---

## 📡 REST API Documentation

### Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Retrieve all expenses (supports `?category=Food` and `?search=coffee`) |
| `GET` | `/api/expenses/{id}` | Get single expense details by ID |
| `POST` | `/api/expenses` | Record a new expense (validated) |
| `PUT` | `/api/expenses/{id}` | Update an existing expense (validated) |
| `DELETE` | `/api/expenses/{id}` | Delete an expense |
| `GET` | `/api/expenses/summary` | Get aggregated analytics (total, average, top category, breakdowns) |
| `GET` | `/api/expenses/categories` | Get all available categories |
| `GET` | `/api/health` | Health check probe |

### Sample Payloads

#### Create Expense Request (`POST /api/expenses`)
```json
{
  "title": "Flight to San Francisco",
  "amount": 285.50,
  "category": "Travel",
  "date": "2026-10-27",
  "notes": "Conference flight ticket"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": 1,
    "title": "Flight to San Francisco",
    "amount": 285.50,
    "category": "Travel",
    "date": "2026-10-27",
    "notes": "Conference flight ticket",
    "createdAt": "2026-10-27T15:00:00",
    "updatedAt": "2026-10-27T15:00:00"
  },
  "timestamp": "2026-10-27T15:00:00"
}
```

#### Validation Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "status": 400,
  "error": "Bad Request",
  "message": "Amount must be greater than zero",
  "fieldErrors": {
    "title": "Title cannot be empty",
    "amount": "Amount must be greater than zero"
  },
  "timestamp": "2026-10-27T15:00:00"
}
```

---

## 🧪 Running Automated Tests

To run the backend test suite (unit tests and WebMvc controller mock tests):

```bash
cd backend
./mvnw test
```

All 13 test cases test:
- Successful expense creation
- Validation rejection on empty titles
- Validation rejection on non-positive amounts
- Expense lookups, updates, and deletions
- Correct summary calculation across categories
- MockMvc controller endpoints and serialization


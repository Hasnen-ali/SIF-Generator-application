# 📄 SIF Generator

> A web application that generates **Salary Information Files (.SIF)** from employee salary data — built for payroll teams to produce bank-ready salary files quickly and accurately.

---

## 🧾 What Is This Application?

The **SIF Generator** is an internal web tool that allows HR and payroll staff to:

- Enter employee salary details through a simple online form
- Instantly generate a `.SIF` (Salary Information File) in the correct pipe-separated format required by banks
- Download the file automatically to their computer
- Preview the file content before downloading
- View a history of all previously generated SIF files

No technical knowledge is required to use the application — just fill in the form and click **Generate SIF**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📝 Simple Form | Enter employee details in a clean, easy-to-use form |
| ✅ Smart Validation | Catches errors before submission (e.g. QID must be exactly 11 digits) |
| 📥 Auto Download | The `.sif` file downloads automatically after generation |
| 👁️ File Preview | See the exact file content before it downloads |
| 🕓 History Table | View all previously generated SIF records |
| 🌙 Dark Mode | Toggle between light and dark interface |
| 📱 Mobile Friendly | Works on desktop, tablet, and mobile |
| 🔔 Notifications | Clear success and error messages after every action |

---

## 📋 Form Fields

| Field | Description | Rules |
|---|---|---|
| **Employee QID** | Qatar ID number | Exactly 11 digits, numbers only |
| **Employee Name** | Full name of the employee | Required |
| **Employee Bank** | Bank name (e.g. QNB, CBQ) | Required |
| **Account Number** | Bank account number | Alphanumeric |
| **Working Days** | Number of days worked | 0 – 31 |
| **Total Salary** | Net salary amount | Must be a positive number |

---

## 📁 Generated File Format

The application produces a pipe-separated `.sif` file. Example:

```
Record Sequence|Employee QID|Employee Name|Employee Bank|Employee Account|Working Days|Net Salary
1|25535664748|SEBASTIAN PAUL|QNB|65641126497|30|10000
```

Files are automatically named using the pattern:
```
SIF_<EMPLOYEE_NAME>_<DATE>.sif
Example: SIF_SEBASTIAN_PAUL_20260507.sif
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| File Generation | Node.js File System (`fs`) |
| Form Handling | React Hook Form + Yup |
| HTTP Client | Axios |
| Notifications | React Toastify |

---

## 🗂️ Project Structure

```
sif-generator/
├── client/                        # React frontend (what users see)
│   ├── public/
│   └── src/
│       ├── components/            # Reusable UI pieces (form, table, preview)
│       ├── pages/                 # Main page layout
│       ├── services/              # API communication layer
│       └── utils/                 # Validation rules and helper functions
│
└── server/                        # Express backend (business logic + file generation)
    ├── controllers/               # Request handlers
    ├── routes/                    # API route definitions
    ├── models/                    # MongoDB data schema
    ├── utils/                     # SIF generation logic + validators
    ├── middleware/                 # Error handling
    └── generated-files/           # All generated .sif files are saved here
```

---

## 🚀 Setup & Installation (For Developers)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- npm (comes with Node.js)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/sif-generator.git
cd sif-generator
```

---

### Step 2 — Backend Setup

```bash
cd server
npm install
```

Create a file named `.env` inside the `server/` folder with the following content:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sif_generator
CLIENT_URL=http://localhost:3000
```

> 💡 If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the backend server:

```bash
npm run dev
```

The server will run at: `http://localhost:5000`

---

### Step 3 — Frontend Setup

Open a **new terminal**, then:

```bash
cd client
npm install
```

Create a file named `.env` inside the `client/` folder with the following content:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open automatically at: `http://localhost:3000`

---

### Step 4 — Open the App

Visit **http://localhost:3000** in your browser. Both the backend and frontend must be running at the same time.

---

## 🔌 API Reference

### `POST /api/generate-sif`

Generates and saves a SIF file.

**Request Body:**
```json
{
  "employeeQID": "25535664748",
  "employeeName": "SEBASTIAN PAUL",
  "employeeBank": "QNB",
  "employeeAccount": "65641126497",
  "workingDays": 30,
  "totalSalary": 10000
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "SIF generated successfully",
  "downloadUrl": "/generated-files/SIF_SEBASTIAN_PAUL_20260507.sif",
  "fileName": "SIF_SEBASTIAN_PAUL_20260507.sif",
  "sifContent": "Record Sequence|Employee QID|...\n1|25535664748|..."
}
```

### `GET /api/history`

Returns all previously generated SIF records from the database.

---

## ⚙️ Environment Variables

### Server — `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/sif_generator` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |

### Client — `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongoose` | MongoDB object modeling |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable management |
| `express-async-errors` | Async error handling |
| `sanitize-html` | Input sanitization |
| `nodemon` *(dev)* | Auto-restart on file changes |

### Frontend
| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-hook-form` | Form state management |
| `yup` | Schema-based validation |
| `axios` | HTTP requests to backend |
| `react-toastify` | Toast notifications |
| `tailwindcss` | Utility-first CSS framework |

---

## 🗄️ Database Schema

Each generated SIF record is saved to MongoDB with the following structure:

```js
{
  employeeQID:       String,   // 11-digit Qatar ID
  employeeName:      String,   // Full name
  employeeBank:      String,   // Bank name
  employeeAccount:   String,   // Account number
  workingDays:       Number,   // Days worked
  totalSalary:       Number,   // Net salary
  generatedFileName: String,   // e.g. SIF_SEBASTIAN_PAUL_20260507.sif
  createdAt:         Date      // Auto-generated timestamp
}
```

---

## 🔒 Validation Rules

| Field | Rule |
|---|---|
| Employee QID | Required · Exactly 11 digits · Numbers only |
| Employee Name | Required · Text only |
| Employee Bank | Required |
| Account Number | Required · Alphanumeric |
| Working Days | Required · Number between 0 and 31 |
| Total Salary | Required · Positive number |

Validation runs on **both the frontend** (instant feedback) and **backend** (security check).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

*Built with ❤️ using the MERN Stack*

# G-Scores
This project parse student's scores from a `.csv` to Postgre `Supabase` database and provide a web UI to allow student to search thier score by `studentId`.

Demo: https://webdev-intern-assignment-3-6noe.vercel.app

![](./docs/Screenshot_20260703_095759.png)


## Features
- **Score Lookup:** Check scores from registration number input.
- **Report**: Interactive charts to visuallize score data.
- **Top 10 students of group A**: Top 10 students in Math, Physics, and Chemistry.
- **Responsive design**: Look good on all devices: desktops, tablets & mobile phones.

# Techstack
## Frontend
- ReactJS
- TailwindCSS
- Typescript
- Recharts

## Backend
- NodeJS + ExpressJS.
- Typescript


## Databases
- Postgre (Supabase).
- Prisma ORM.

# Project Structure
```
web/
├── dataset/                    # Raw CSV exam score dataset
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Normalized database schema
│   │   └── seed.ts             # Sequential streaming database seeder
│   ├── src/
│   │   ├── index.ts            # Entrypoint with global crash protection
│   │   ├── app.ts              # Express App setup & middleware
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # Express routes
│   │   ├── services/           # DB queries with service-level caching
│   │   ├── models/             # Student, Subject, and Score models
│   │   └── validators/         # Input validators using Zod
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Search, Stats Chart, and Leaderboard components
    │   ├── App.tsx             # Main dashboard layout
    │   └── main.tsx
    └── package.json
```

# Installation

## Docker Compose (Recommended)
You can run the entire stack (PostgreSQL database, Node.js API, and Vite React frontend) with a single command:

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```
2. **Seed the database (Optional)**:
   Ensure you have the raw CSV dataset in `dataset/diem_thi_thpt_2024.csv`, then run the database seeder inside the backend container:
   ```bash
   docker-compose exec backend npm run db:seed
   ```
3. **Restart the application**:
   ```
   docker-compose down
   ```
   then
   ```
   docker-compose up 
   ```
4. **Access the application**:
   - Frontend Dashboard: [http://localhost:5173](http://localhost:5173)
   - Backend Health Status: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

---

## Manual Installation (Local)
### Database
1. First of all, you need to setup your environment variables in `/backend/.env` file  
**Option 1:** Supabase provides many connection methods, some methods only work with IPv6 network. Personally, I use `Session pooler` because it works well with my IPv4 network.

```
DATABASE_URL="postgresql://admin:secret@localhost:5432/gscores"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

**Option 2: (Recommend)** Supabase currently has some uptime problems. So I switch to self-hosted my on PostgreSQL on Docker container on a Vultr and it works smoothly. Btw, you just need to put correct Postgres URI string to `.env` file.

- In `/docs/postgres` folder start postgres docker container
```
sudo docker-compose up -d
```

2. In `/backend` root folder. Generate prisma client file
```
npm run db:generate
```

3. Migrate new database schema
```
npm run db:migrate
```

**Optional:**
Seed data to database from (.csv) (`Optional`, you do not need to do this if your database already has data, this script also flush all old data before seeding)   
**NOTE:** For me, it takes about `10 minutes` to seed all data from using `3` concurrent connections, it depend on your database server hardwares. To increase seed speed, you can modify connection `limit` in URI and `BATCH_SIZE` in `seed.ts`.
```
npm run db:seed
```

## Backend
1. In `/backend` folder. Set `.env` variables
```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

2. To start backend 
```
npm run dev
```

## Frontend
1. In `/frontend` folder. Set `.env` variables
```
VITE_API_URL=http://localhost:3001
```
2. To start frontend
```
npm run dev
```

# Version

## v1.3.0 - Statistics - 2026-07-02 
- Schema for Statistics. 
- API for Statistics.
- UI for Statistics.

## v1.2.0 - Top Group A - 2026-07-02 
- Schema for Top Group A.
- API for Top Group A. 
- UI for Top Group A. 

## v1.1.0 - Score - 2026-07-02 
- Schema for Scores.
- API for Scores.
- UI for Scores.

## v1.0.0 - Init - 2026-07-01
- Init backend folder structure.
- Create healhcheck API.
- Create global error handler.
- Create database schema and seed.



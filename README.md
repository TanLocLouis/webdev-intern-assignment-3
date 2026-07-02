# G-Scores
This project parse student's scores from a `.csv` to Postgre `Supabase` database and provide a web UI to allow student to search thier score by `studentId`.

# Requirements
1. From the raw data file ([diem_thi_thpt_2024.csv](./dataset/diem_thi_thpt_2024.csv)) save it into the database with the appropriate structure

2. Your application should have at least features in [Must have](#must-have), things in [Nice to have](#nice-to-have) is optional (but yeah, it's attractive if you have).

### Must have:
- The conversion of raw data into the database must be coded and located in this source code. (**hint**: recommend use migration and seeder)
- Write a feature to check score from registration number input
- Write a feature report. There will be 4 levels including: >=8 points, 8 points > && >=6 points, 6 points > && >= 4 points, < 4 points
    - Statistics of the number of students with scores in the above 4 levels by subjects. (Chart)
- List top 10 students of group A including (math, physics, chemistry)
### Nice to have:

- Responsive design (look good on all devices: desktops, tablets & mobile phones).
- Setup project use Docker.
- Deploy the application to go live.

# Techstack
## Frontend
- ReactJS
- TailwindCSS
- Typescript
- rechart lib

## Backend
- NodeJS + ExpressJS.
- Typescript

## Databases
- Postgre (Supabase).
- Prisma ORM.

# Installation
## Database
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
**NOTE:** It takes about 50 minutes to seed all data from `.csv` to `Postgres`
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



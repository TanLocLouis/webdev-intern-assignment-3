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

## Backend
- NodeJS + ExpressJS.

## Databases
- Postgre (Supabase).

# Installation
1. First of all, you need to setup your environment variables in `/backend/.env` file  
**NOTE:** Supabase provides many connection methods, some method only works with IPv6 network. Personally, I use `Session pooler` because it works well with my IPv4 network.
<!-- **ANOTHER NOTE:** Supabase `uptime` is pretty bad, so I might use other Postgre alternatives. -->
```
DATABASE_URL="postgresql://admin:secret@localhost:5432/gscores"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

2. In `/backend` root folder. Generate prisma client file
```
npm run db:generate
```

3. Migrate new database schema
```
npx prisma migrate dev --name add_top_group_a_table
```
or
```
npm run db:migrate
```

4. Push new schema to Supabase (Postgre)
```
npm run db:push
```

5. (Optional, you do not need to do this if your database already has data, this script also flush all old data before seed) Seed data to database from (.csv)

```
npm run db:seed
```

# Version

## v1.0.0 - Init - 2026-07-01
- Init backend folder structure.
- Create healhcheck API.
- Create global error handler.
- Create database schema and seed.



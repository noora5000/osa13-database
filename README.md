Download dependencies
`npm install`

Database works with Docker Postgres-container.
Create and run Docker container:
```
docker run -d \
  --name bloglist-postgres \
  -e POSTGRES_PASSWORD=<yourpassword> \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /custom/mount:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres
  ```
Create a table inside the Postgres container (e.g. command line `docker exec -it bloglist-postgres psql -U postgres postgres`).
Command to create the table for bloglist:
```
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);
```

  Add Docker url to .env.:
  ```
  DATABASE_URL=postgres://postgres:<yourpassword>@localhost:5432/postgres
  ```

Run app on dev mode or normal mode
`npm run dev` or `npm start`
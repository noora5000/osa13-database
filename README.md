Download dependencies
`npm install`

Database works with Docker Postgres-container.
Create and run Docker container (Linux command line):
```
docker run -d \
  --name bloglist-postgres \
  -e POSTGRES_PASSWORD=<yourpassword> \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /custom/mount:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres
  ```
  Add Docker url to .env.:
  ```
  DATABASE_URL=postgres://postgres:<yourpassword>@localhost:5432/postgres
  ```

Run app on dev mode or normal mode
`npm run dev` or `npm start`
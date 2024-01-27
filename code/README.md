## Getting Started

### Local setup

Please ensure you have the following tools installed:

- node v20
- pnpm v8
- docker

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cladius6/movie-api-tsh
   ```

2. Navigate to the project directory:

   ```bash
   cd movie-api-task
   ```

3. Install dependencies:

   ```bash
   cd code
   pnpm install
   ```

4. Build app:

   ```bash
   pnpm run build
   ```

5. Start app:

   ```bash
   pnpm run start
   ```

   OR

   ```bash
   pnpm run start:dev
   ```

   OR by using docker

   ```bash
   docker-compose up --build
   ```

### Generating db types

Types from `db.json` are generated thanks to quicktype. So after we change database schema we should run:

```bash
pnpm run dbtypes
```

### Running tests:

```bash
pnpm run test
```

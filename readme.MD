
## Setup

### Clone the repository
```bash
git clone https://github.com/reganputra/manajemen-ssb.git
```
### Install dependencies
```bash
npm install
```

### Prisma Init
```bash
npx prisma init
``````

### Database migrations
```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Generate prisma schema
npx prisama generate
````

### add in a .env file
```bash
PORT= YOUR_PORT
DATABASE_URL= YOUR_DATABASE_URL
JWT_SECRET= YOUR_JWT_SECRET

# AWS S3
AWS_BUCKET_NAME=YOUR_BUCKET_NAME
AWS_BUCKET_REGION=YOUR_BUCKET_AWS_BUCKET_REGION
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
 ```
### Run the app
```bash
npm run dev
```

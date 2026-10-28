FROM node:20-alpine

WORKDIR /app

# Copy the npm lockfile used by CI and Vercel.
COPY package.json package-lock.json ./

# Install dependencies using pnpm
RUN npm ci

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Note: Database migrations should be run after environment variables are available
# They will be run via docker-compose command or manually
CMD ["npm", "run", "dev"]

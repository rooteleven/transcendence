FROM node:19-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# The prisma generate command generates code or artifacts based on your Prisma schema, which is defined in a file called schema.prisma.

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Implement npx prisma migrate dev

CMD [ "sh", "./entrypoint.sh" ]

FROM node:14

# Copy or mount node app here
WORKDIR /data/

COPY . .

RUN npm install
RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]


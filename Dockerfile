FROM node:13-alpine

# Install curl
RUN apk add --no-cache curl

RUN mkdir -p /home/app
ENV NODE_ENV=production
ENV user=admin
ENV database=test_db
ENV password=mypassword

# Copy the entrypoint script into the Docker image
COPY ./entrypoint.sh /home/app/
RUN chmod +x /home/app/entrypoint.sh

COPY ./app /home/app
WORKDIR /home/app
RUN npm install

EXPOSE 8888

# Set entrypoint as the entrypoint script
ENTRYPOINT ["/home/app/entrypoint.sh"]

CMD ["node","/home/app/server.js"]
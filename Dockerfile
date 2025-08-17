# Use the official Node.js 18 image as the base image so that the image building 
# has something to start from.

FROM node:18

# Set the working directory - we want to avoid running inside the containers root directory

WORKDIR /app

# Now lets copy the package.json and package-lock.json files

COPY package*.json ./

# Install the application dependencies by checking if there is a package-lock.json file.
# If there is one, we use npm ci to download the exact versions specified in the lock file.
# If there isn't one, we fall back to npm install, which will install the latest versions that 
# satisfy the semantic versioning ranges in package.json.

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the application code

COPY . .

# Document the port that the application runs on (if it does).
# This isn't mandatory but some Docker applications rely on it + it helps other devs understand
# how to run the app.

EXPOSE 3000

# Start the application by instructing Docker to use npm, the node package manager used for Node.js
# and the start instruction

CMD ["npm", "start"]
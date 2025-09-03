#!/bin/bash

# Start the server in the background and log output
npm run dev -- -p 0 &> server.log &
SERVER_PID=$!

# Kill the server on exit
trap 'kill $SERVER_PID' EXIT

# Wait for the server to be ready and get the port
echo "Waiting for server to start..."
PORT=$(grep -o 'http://localhost:[0-9]*' server.log | head -n 1 | sed 's/http:\/\/localhost://')
while [ -z "$PORT" ]; do
  sleep 1
  PORT=$(grep -o 'http://localhost:[0-9]*' server.log | head -n 1 | sed 's/http:\/\/localhost://')
done

echo "Server started on port $PORT"

# Run the BDD tests
BDD_PORT=$PORT npm run test:bdd

# Exit trap will kill the server

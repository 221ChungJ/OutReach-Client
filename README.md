# OutReach Interviewee and Researcher Clients

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Environment

To run both clients in development mode with hot reloading:

```bash
docker compose up dev
```

This will:
- Install the latest Node.js LTS version
- Install dependencies for both clients
- Start both dev servers
- Enable hot reloading for source code changes

**Access your applications:**
- Researcher Client: http://localhost:5173
- Interview Agent: http://localhost:5174

## Alternative Docker Commands

### Using Docker Compose (Recommended)
```bash
# Start in detached mode (runs in background)
docker-compose up -d dev

# Stop the containers
docker compose down
```

### Manual Docker Commands
```bash
# Build development image
docker build -f docker -t vite-projects-dev .

# Run development container
docker run -p 5173:5173 -p 5174:5174 \
  -v $(pwd)/researcher-client-component/src:/app/researcher-client-component/src \
  -v $(pwd)/interview-agent-component/src:/app/interview-agent-component/src \
  -v $(pwd)/researcher-client-component/public:/app/researcher-client-component/public \
  -v $(pwd)/interview-agent-component/public:/app/interview-agent-component/public \
  vite-projects-dev
```

## Features

- **Latest Node.js**: Uses the latest LTS version of Node.js
- **Hot reloading**: Live code changes are reflected immediately
- **Port isolation**: Each project runs on its own port (5173 and 5174)
- **Volume mounting**: Source code is mounted for instant updates

## Troubleshooting

### Port conflicts
If ports 5173 or 5174 are already in use, you modify the docker-compose.yml file to use different ports:

```yaml
ports:
  - "3000:5173"  # Change left side to any available port
  - "3001:5174"  # Change left side to any available port
```

# XYNERA IA Deployment Guide

## System Requirements

### Hardware Requirements
- CPU: 4+ cores
- RAM: 16GB minimum, 32GB recommended
- Storage: 100GB SSD minimum
- Network: 1Gbps minimum

### Software Requirements
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- Docker (optional)
- PostgreSQL 14+ (optional, for local development)

## Environment Setup

### Environment Variables
Create a `.env` file in the root directory:

```env
# App Configuration
NODE_ENV=production
PORT=8000
APP_URL=https://your-domain.com

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/xynera
DATABASE_SSL=true

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# API Keys
OPENAI_API_KEY=your-openai-key
ANALYTICS_KEY=your-analytics-key

# External Services
ESG_API_ENDPOINT=https://esg-api.example.com
SECURITY_SERVICE_URL=https://security.example.com
MONITORING_SERVICE_URL=https://monitoring.example.com
```

### SSL Configuration
For production deployments, configure SSL certificates:

```bash
# Generate SSL certificate using Let's Encrypt
certbot certonly --nginx -d your-domain.com

# Certificate locations
SSL_CERTIFICATE=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

## Development Deployment

1. Clone the repository:
```bash
git clone https://github.com/your-org/xynera-ia.git
cd xynera-ia
```

2. Install dependencies:
```bash
npm install
```

3. Set up the development database:
```bash
# Start PostgreSQL
docker run -d \
  --name xynera-db \
  -e POSTGRES_USER=xynera \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=xynera \
  -p 5432:5432 \
  postgres:14
```

4. Run migrations:
```bash
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

## Production Deployment

### Using Docker

1. Build the Docker image:
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t xynera-ia .
docker run -d -p 8000:8000 --name xynera-ia xynera-ia
```

### Using PM2

1. Install PM2:
```bash
npm install -g pm2
```

2. Create ecosystem config:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'xynera-ia',
    script: 'npm',
    args: 'start',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    }
  }]
}
```

3. Start the application:
```bash
pm2 start ecosystem.config.js
```

### Using Kubernetes

1. Create Kubernetes deployment:
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xynera-ia
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xynera-ia
  template:
    metadata:
      labels:
        app: xynera-ia
    spec:
      containers:
      - name: xynera-ia
        image: xynera-ia:latest
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

2. Create service:
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: xynera-ia
spec:
  selector:
    app: xynera-ia
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

3. Apply configurations:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Monitoring and Logging

### Prometheus Configuration
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'xynera-ia'
    static_configs:
      - targets: ['localhost:8000']
```

### Grafana Dashboard
Import the provided dashboard template:
```json
{
  "dashboard": {
    "id": null,
    "title": "XYNERA IA Dashboard",
    "panels": [
      // Dashboard configuration
    ]
  }
}
```

### Log Management
Configure log aggregation using ELK Stack:

```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "xynera-logs-%{+YYYY.MM.dd}"
  }
}
```

## Backup and Recovery

### Database Backup
Schedule regular backups:

```bash
# Backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U xynera -d xynera > backup_${TIMESTAMP}.sql

# Compress backup
gzip backup_${TIMESTAMP}.sql

# Upload to cloud storage
aws s3 cp backup_${TIMESTAMP}.sql.gz s3://xynera-backups/
```

### Recovery Procedure
1. Stop the application
2. Restore database:
```bash
gunzip backup_file.sql.gz
psql -U xynera -d xynera < backup_file.sql
```
3. Restart the application

## Security Considerations

1. Enable rate limiting:
```javascript
const rateLimit = require('express-rate-limit')

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
```

2. Configure CORS:
```javascript
const cors = require('cors')

app.use(cors({
  origin: process.env.APP_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

3. Set security headers:
```javascript
const helmet = require('helmet')

app.use(helmet())
```

## Performance Optimization

1. Enable compression:
```javascript
const compression = require('compression')
app.use(compression())
```

2. Configure caching:
```javascript
app.use(cache('2 hours'))
```

3. Optimize static assets:
```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}))
```

## Troubleshooting

### Common Issues

1. Connection Errors
```bash
# Check database connection
nc -zv localhost 5432

# Check logs
tail -f /var/log/xynera/error.log
```

2. Performance Issues
```bash
# Monitor system resources
top -u xynera

# Check Node.js memory usage
node --inspect
```

3. SSL Issues
```bash
# Verify SSL configuration
openssl s_client -connect your-domain.com:443
```

### Support Contacts

- Technical Support: tech-support@xynera.ai
- Security Issues: security@xynera.ai
- Emergency Contact: +1-XXX-XXX-XXXX

## Maintenance

### Regular Tasks

1. Update dependencies:
```bash
npm audit
npm update
```

2. Monitor disk usage:
```bash
df -h
```

3. Rotate logs:
```bash
logrotate /etc/logrotate.d/xynera
```

### Emergency Procedures

1. Quick rollback:
```bash
git checkout last-known-good-commit
npm install
npm run build
pm2 restart all
```

2. Emergency shutdown:
```bash
pm2 stop all
```

For additional support, contact the DevOps team or refer to the internal documentation.

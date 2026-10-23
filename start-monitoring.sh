#!/bin/bash

echo "🚀 Starting CloudSphere with Monitoring Stack..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update with your settings if needed."
fi

# Start services
echo ""
echo "Starting services..."
docker compose --profile app up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Services started!"
echo ""
echo "📊 Access your services:"
echo "  - Application:  http://localhost:8080"
echo "  - Swagger UI:   http://localhost:8080/swagger-ui"
echo "  - Prometheus:   http://localhost:9090"
echo "  - Grafana:      http://localhost:3000 (admin/admin)"
echo ""
echo "📈 Grafana Dashboard: CloudSphere Application Performance"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop: docker compose --profile app down"

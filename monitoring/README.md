# CloudSphere Monitoring Setup

This directory contains the configuration for monitoring the CloudSphere application using Prometheus and Grafana.

## Components

### Prometheus
- **Port**: 9090
- **Purpose**: Collects metrics from the Spring Boot application
- **Configuration**: `prometheus.yml`

### Grafana
- **Port**: 3000
- **Purpose**: Visualizes metrics in dashboards
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin` (change via environment variables)

## Quick Start

1. **Start the monitoring stack**:
   ```bash
   docker-compose --profile app up -d
   ```

2. **Access the services**:
   - Application: http://localhost:8080
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000

3. **Login to Grafana**:
   - Navigate to http://localhost:3000
   - Login with username `admin` and password `admin`
   - The CloudSphere dashboard will be automatically provisioned

## Available Metrics

The application exposes metrics at: `http://localhost:8080/actuator/prometheus`

### Key Metrics Include:
- **HTTP Metrics**: Request rate, response times, status codes
- **JVM Metrics**: Memory usage, garbage collection, thread counts
- **Database Metrics**: Connection pool status, query performance
- **System Metrics**: CPU usage, system load
- **Custom Application Metrics**: Business-specific metrics

## Dashboard Features

The pre-configured "CloudSphere Application Performance" dashboard includes:

1. **Overview Panel**:
   - Application uptime
   - CPU usage
   - Memory usage
   - Request rate

2. **HTTP Metrics**:
   - Request rate by endpoint
   - Average response times
   - Error rates

3. **JVM Performance**:
   - Memory usage by pool
   - Thread counts
   - Garbage collection

4. **Database Performance**:
   - Connection pool status
   - Active/idle connections

## Configuration

### Changing Grafana Admin Credentials

Update in `.env` file or docker-compose.yml:
```bash
GRAFANA_ADMIN_USER=your-username
GRAFANA_ADMIN_PASSWORD=your-secure-password
```

### Adding Custom Dashboards

1. Place dashboard JSON files in `monitoring/grafana/dashboards/`
2. Restart Grafana: `docker-compose restart grafana`

### Modifying Prometheus Scrape Interval

Edit `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s  # Change as needed
```

## Troubleshooting

### Prometheus can't reach the API
- Ensure the API is running with profile `app`
- Check that the API exposes metrics at `/actuator/prometheus`
- Verify Docker network connectivity

### Grafana shows no data
- Check Prometheus is scraping successfully at http://localhost:9090/targets
- Verify the Prometheus datasource is configured correctly in Grafana
- Ensure the application is generating traffic

### Dashboard not appearing
- Check Grafana logs: `docker logs cloudsphere-grafana`
- Verify dashboard JSON is valid
- Restart Grafana to force re-provisioning

## Data Persistence

Metrics and dashboard configurations are persisted in Docker volumes:
- `prometheus-data`: Prometheus time-series data
- `grafana-data`: Grafana settings and custom dashboards

To reset data:
```bash
docker-compose down -v
docker-compose --profile app up -d
```

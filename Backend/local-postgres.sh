  docker run -d \
    --name postgres-local \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin123 \
    -e POSTGRES_DB=ecommerce \
    -p 5432:5432 \
    postgres:16
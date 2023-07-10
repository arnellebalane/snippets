# Install Prisma CLI binaries to /opt/nodejs/node_modules
cd /asset-input/functions/migrate-database/layer
PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x npm ci
mkdir -p /asset-output/nodejs
cp -r node_modules /asset-output/nodejs

# Copy migrations files to /opt/prisma
cd /asset-input
cp -r prisma /asset-output

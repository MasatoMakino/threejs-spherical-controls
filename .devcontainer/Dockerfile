FROM node:22-bookworm-slim

# Install Git for Biome --staged option support
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Switch to non-root user
USER node

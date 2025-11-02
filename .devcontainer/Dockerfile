FROM mcr.microsoft.com/devcontainers/javascript-node:22

USER root

# Pre-create volume mount point and set ownership to node user
RUN mkdir -p /workspaces/threejs-spherical-controls/node_modules && \
    chown -R node:node /workspaces/threejs-spherical-controls

USER node

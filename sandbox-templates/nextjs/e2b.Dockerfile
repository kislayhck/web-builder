# You can use most Debian-based base images
FROM node:21-slim

# Make bash default shell for RUN (safer pipes & errors)
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install curl (used by compile script)
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy & normalize the start script (fix CRLF) + make it executable
COPY compile_page.sh /compile_page.sh
RUN sed -i 's/\r$//' /compile_page.sh && chmod +x /compile_page.sh

# Prepare app
WORKDIR /home/user/nextjs-app
RUN npx --yes create-next-app@15.3.3 . --yes

# Optional: ensure deps after scaffolding (safe even if already installed)
RUN npm install

# shadcn components
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move the app to /home/user (including node_modules) and remove the old folder
RUN shopt -s dotglob nullglob && mv /home/user/nextjs-app/* /home/user/ && rmdir /home/user/nextjs-app

# Next.js & sandbox ergonomics
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Start the app through the compile script
CMD ["/bin/bash", "-lc", "/compile_page.sh"]

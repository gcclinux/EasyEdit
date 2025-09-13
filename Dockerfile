FROM node:20-bullseye-slim AS builder
WORKDIR /build

# Cache package install
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage: small image that only serves the built dist and includes requested files
FROM node:20-alpine AS runtime
WORKDIR /app

# Install a tiny static server
RUN npm install -g serve --no-audit --no-fund --silent

# Copy the build output and the specific files/dirs you requested
COPY --from=builder /build/dist ./dist
# Copy additional files/dirs to include in the image (as requested)
COPY --from=builder /build/src ./src
COPY --from=builder /build/about ./about
COPY --from=builder /build/release ./release
COPY --from=builder /build/src/assets ./src/assets
COPY --from=builder /build/public ./public
COPY --from=builder /build/screenshots ./screenshots
COPY --from=builder /build/index.html ./index.html
COPY --from=builder /build/LICENSE ./LICENSE
COPY --from=builder /build/preload.js ./preload.js
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/tsconfig.app.json ./tsconfig.app.json
COPY --from=builder /build/tsconfig.json ./tsconfig.json
COPY --from=builder /build/tsconfig.node.json ./tsconfig.node.json
COPY --from=builder /build/vite.config.ts ./vite.config.ts
COPY --from=builder /build/main.cjs ./main.cjs

# Expose the Vite/preview port
EXPOSE 3024

ENV NODE_ENV=production
# Serve the built app on port 3024 using 'serve'
CMD ["serve", "-s", "dist", "-l", "3024"]

# BUILD PROD
# docker build -f Dockerfile.prod -t gcclinux/easyedit:1.3.8 .
# RUN
# docker run --name EASYEDIT --rm -p 3024:3024 gcclinux/easyedit:1.3.8
# or to run in background (detached)
# docker run -d --name EASYEDIT -p 3024:3024 gcclinux/easyedit:1.3.8
# To stop
# docker stop EASYEDIT
# To remove (only if not started with --rm)
# docker rm EASYEDIT
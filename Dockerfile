# Reproducible dev/build/test environment — pins Node/npm and the Playwright
# browser + system deps so `npm run build`, `npm test`, `npm run lint`, and
# any Playwright-driven QA give identical results regardless of host machine.
# Not used by Netlify (it builds dist/ directly from source) — this is purely
# for local/CI parity.
FROM node:22-bookworm

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Chromium + its OS-level deps (fonts, libnss3, etc.), matching the
# playwright version pinned in package-lock.json.
RUN npx playwright install --with-deps chromium

COPY . .

ENV CI=true

CMD ["bash"]

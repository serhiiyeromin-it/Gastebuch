# FROM node:22-alpine3.20

# WORKDIR /backend
# COPY package.json package-lock.json ./
# RUN npm install --omit=dev

# COPY . .

# EXPOSE 3050

# CMD ["node", "server.js"]

# Nutzt Node.js 22 mit Alpine Linux als leichtgewichtiges Basis-Image
FROM node:22-alpine3.20

# Setzt das Arbeitsverzeichnis im Container auf /backend
WORKDIR /backend

# Kopiert package.json und package-lock.json für effizienteres Caching
COPY package.json package-lock.json ./

# Installiert nur Produktionsabhängigkeiten (ohne devDependencies)
RUN npm install --omit=dev

# Kopiert den gesamten Code ins Arbeitsverzeichnis
COPY . .

# Öffnet Port 3050 für den Container
EXPOSE 3050

# Startet die Anwendung
CMD ["node", "server.js"]

# Deployment (IP-only / HTTP)

This repo includes a production-ish Docker Compose setup:

- `mongo:7` (persistent volume)
- `backend` (FastAPI/uvicorn, internal port 8000)
- `frontend` (CRA build served as static files)
- `nginx` (reverse proxy: `/` -> frontend, `/api/` -> backend)

## Quick start (Ubuntu server)

Run the bootstrap script as root:

- `sudo bash scripts/bootstrap_ubuntu_ip_only.sh`

It will:
- Install Docker Engine + Compose plugin
- Clone this repo into `/opt/ghl-clone`
- Create `/opt/ghl-clone/.env` from `.env.example`
- Build and start containers via `docker compose`

## After boot

- App: `http://<server-ip>/`
- Backend docs: `http://<server-ip>/docs`

## Notes

- Let's Encrypt cannot issue certificates for bare IP addresses. For HTTPS, add a domain + DNS and then add TLS configuration.

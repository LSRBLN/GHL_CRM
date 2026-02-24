#!/usr/bin/env bash
set -euo pipefail

# Bootstrap for Ubuntu server: Docker + Compose, clone repo, configure env, start stack.
# Intended for IP-only HTTP deployments (no Let's Encrypt).

DEPLOY_DIR="/opt/ghl-clone"
REPO_URL="https://github.com/LSRBLN/GHL_CRM.git"
BRANCH="main"

say() { printf "\n==> %s\n" "$*"; }

need_root() {
  if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    echo "Please run as root (use sudo)." >&2
    exit 1
  fi
}

install_prereqs() {
  say "Installing base packages (git, ufw, ca-certificates, curl, gnupg)"
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg git ufw
}

install_docker_official_repo() {
  say "Installing Docker Engine + Compose plugin (official Docker APT repo)"

  install -m 0755 -d /etc/apt/keyrings
  if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
  fi

  # shellcheck disable=SC1091
  source /etc/os-release
  : "${VERSION_CODENAME:?VERSION_CODENAME missing in /etc/os-release}"

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable --now docker
}

ensure_user_in_docker_group() {
  local user_name
  user_name="${SUDO_USER:-}"
  if [[ -n "$user_name" ]]; then
    say "Adding user '$user_name' to docker group"
    groupadd -f docker
    usermod -aG docker "$user_name" || true
    echo "NOTE: You may need to log out/in for docker group changes to apply." >&2
  fi
}

setup_firewall_rules() {
  say "Allowing firewall ports 80/443 (not enabling ufw automatically)"
  ufw allow 80/tcp || true
  ufw allow 443/tcp || true
  echo "UFW status:" 
  ufw status || true
}

clone_repo() {
  say "Resetting deploy dir: ${DEPLOY_DIR}"
  rm -rf "$DEPLOY_DIR"
  mkdir -p "$DEPLOY_DIR"
  chown -R "${SUDO_USER:-root}:${SUDO_USER:-root}" "$DEPLOY_DIR" || true

  say "Cloning repo ${REPO_URL} (branch: ${BRANCH})"
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$DEPLOY_DIR"
}

ensure_env_file() {
  say "Creating .env from .env.example (placeholders)"
  if [[ -f "$DEPLOY_DIR/.env" ]]; then
    echo "Found existing $DEPLOY_DIR/.env (leaving as-is)."
    return 0
  fi

  if [[ ! -f "$DEPLOY_DIR/.env.example" ]]; then
    echo "Missing $DEPLOY_DIR/.env.example - repo is incomplete." >&2
    exit 1
  fi

  cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env"

  # Best-effort default for IP-only; user can edit later.
  if grep -q '^CORS_ORIGINS=' "$DEPLOY_DIR/.env"; then
    # do not overwrite if already set by template
    true
  fi
}

compose_up() {
  say "Building & starting containers"
  cd "$DEPLOY_DIR"

  # Use root-run docker; compose plugin installed.
  docker compose build
  docker compose up -d

  say "Container status"
  docker compose ps
}

smoke_tests() {
  say "Smoke test via localhost"
  set +e
  curl -fsS http://localhost/ >/dev/null && echo "OK: http://localhost/" || echo "WARN: http://localhost/ failed"
  curl -fsS http://localhost/docs >/dev/null && echo "OK: http://localhost/docs" || echo "WARN: http://localhost/docs failed"
  set -e
}

main() {
  need_root
  install_prereqs
  install_docker_official_repo
  ensure_user_in_docker_group
  setup_firewall_rules
  clone_repo
  ensure_env_file
  compose_up
  smoke_tests

  say "Done"
  echo "App should be reachable on: http://<server-ip>/"
  echo "Logs: cd $DEPLOY_DIR && sudo docker compose logs -f --tail=200"
  echo "Edit env: sudo nano $DEPLOY_DIR/.env"
}

main "$@"

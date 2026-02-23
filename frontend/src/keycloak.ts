import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'demo-monolith',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'frontend-spa',
});

/** In-memory token storage (not localStorage) */
export const tokenStore = {
  accessToken: null as string | null,
  idToken: null as string | null,
};

/** Sync tokens from Keycloak to in-memory store */
function syncTokens() {
  if (keycloak.authenticated) {
    tokenStore.accessToken = keycloak.token ?? null;
    tokenStore.idToken = keycloak.idToken ?? null;
  } else {
    tokenStore.accessToken = null;
    tokenStore.idToken = null;
  }
}

/** Start token refresh interval: refresh if expiring in <30s, check every 45s */
let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

export function startTokenRefresh() {
  if (refreshIntervalId) return;
  refreshIntervalId = setInterval(() => {
    keycloak
      .updateToken(30)
      .then((refreshed) => {
        if (refreshed) {
          syncTokens();
        }
      })
      .catch(() => {
        keycloak.login();
      });
  }, 45_000);
}

export function stopTokenRefresh() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

/** Initialize Keycloak on app startup */
export async function initKeycloak(onLoad: 'check-sso' | 'login-required' = 'check-sso') {
  try {
    const authenticated = await keycloak.init({
      onLoad,
      pkceMethod: 'S256',
    });
    syncTokens();
    if (authenticated) {
      startTokenRefresh();
    }
    return keycloak;
  } catch (error) {
    console.error('Keycloak init failed:', error);
    throw error;
  }
}

export function login() {
  keycloak.login();
}

export function logout() {
  stopTokenRefresh();
  keycloak.logout({ redirectUri: window.location.origin });
}

export { keycloak };

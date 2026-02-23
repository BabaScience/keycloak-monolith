import { useState, useEffect } from 'react'
import { keycloak, login, logout, startTokenRefresh, stopTokenRefresh } from './keycloak'

function App() {
  const [authenticated, setAuthenticated] = useState(keycloak.authenticated ?? false)
  const [username, setUsername] = useState<string | null>(
    keycloak.tokenParsed?.preferred_username ?? null,
  )

  useEffect(() => {
    const updateAuth = () => {
      setAuthenticated(keycloak.authenticated ?? false)
      setUsername(keycloak.tokenParsed?.preferred_username ?? null)
      if (keycloak.authenticated) {
        startTokenRefresh()
      } else {
        stopTokenRefresh()
      }
    }

    updateAuth()
    keycloak.onAuthSuccess = updateAuth
    keycloak.onAuthLogout = updateAuth
    keycloak.onAuthRefreshSuccess = updateAuth
    keycloak.onAuthRefreshError = () => keycloak.login()
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Keycloak Monolith</h1>
      {authenticated ? (
        <>
          <p>Welcome, <strong>{username ?? 'User'}</strong>!</p>
          <p>You are logged in.</p>
          <button
            type="button"
            onClick={() => logout()}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: '#c53030',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <p>Welcome to the monolith skeleton. Backend, frontend, and Keycloak are ready.</p>
          <p>You are not logged in.</p>
          <button
            type="button"
            onClick={() => login()}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: '#2b6cb0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Log in
          </button>
        </>
      )}
    </main>
  )
}

export default App

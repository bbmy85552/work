const AUTH_KEY = 'xuezhi_ai_authed_v1'

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function signIn({ username, password }) {
  const ok = username === 'lixiang' && password === 'lixiang'
  if (ok) localStorage.setItem(AUTH_KEY, '1')
  return ok
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
}



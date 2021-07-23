// window.localStorage
export function getItem(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

export function setItem(key, value) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

// window.sessionStorage
export function getSessItem(key) {
  return JSON.parse(window.sessionStorage.getItem(key));
}

export function setSessItem(key, value) {
  return window.sessionStorage.setItem(key, JSON.stringify(value));
}

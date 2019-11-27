export const WAIT_INTERVAL = 1000;
export const SHOW_SMART_SEARCH = false;
export const BASE_URL = 'http://localhost:3000';

export function getCurrentVersion() {
  return localStorage.getItem('currentVersion');
}
export function base64Encode(obj) {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(obj)))));
}

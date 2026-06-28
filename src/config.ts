/**
 * Utility to resolve API URLs correctly for standard web clients
 * and hybrid mobile Capacitor wrappers.
 */

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : '/' + path;

  // Detect whether the application is running inside a Capacitor webview wrapper on a mobile device,
  // or on a local filesystem/unhosted page, which requires absolute backend URLs.
  const isCapacitor = 
    window.location.protocol.startsWith('capacitor') || 
    window.location.protocol.startsWith('file') || 
    (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173');

  if (isCapacitor) {
    return `https://ais-pre-o2jfy66hetjnnmfx6hnhjv-291883188211.europe-west3.run.app${cleanPath}`;
  }

  return cleanPath;
}

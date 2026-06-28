import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the PWA Offline Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('ESS TBT Service Worker registered successfully with scope:', reg.scope);
        
        // Proactively check for service worker updates immediately on load
        reg.update().catch(err => console.debug('SW initial update check deferred:', err));

        // Check for updates periodically every 10 seconds to catch builds quickly
        const updateInterval = setInterval(() => {
          reg.update().catch(err => console.debug('SW periodic update check deferred:', err));
        }, 10000);

        // Also check for updates when the user returns to/focuses the tab or returns online
        const checkUpdate = () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(err => console.debug('SW visibility update check deferred:', err));
          }
        };
        
        document.addEventListener('visibilitychange', checkUpdate);
        window.addEventListener('online', checkUpdate);

        return () => {
          clearInterval(updateInterval);
          document.removeEventListener('visibilitychange', checkUpdate);
          window.removeEventListener('online', checkUpdate);
        };
      })
      .catch((err) => {
        console.error('ESS TBT Service Worker registration failed:', err);
      });
  });

  // Automatically reload the page when a new service worker takes over/activates
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('[Service Worker] New version detected! Reloading page to apply updates...');
      window.location.reload();
    }
  });
}

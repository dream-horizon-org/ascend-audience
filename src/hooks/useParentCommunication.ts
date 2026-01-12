import { useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/contants';

export const useParentCommunication = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKeyFromUrl = urlParams.get('apiKey');
    const projectKeyFromUrl = urlParams.get('projectKey');
    const projectIdFromUrl = urlParams.get('projectId');

    if (apiKeyFromUrl) {
      console.log('[Audience Panel] Received API Key from URL parameters');
      
      localStorage.setItem(STORAGE_KEYS.PROJECT_API_KEY, apiKeyFromUrl);
      
      if (projectKeyFromUrl) {
        localStorage.setItem(STORAGE_KEYS.PROJECT_KEY, projectKeyFromUrl);
      }
      if (projectIdFromUrl) {
        localStorage.setItem(STORAGE_KEYS.PROJECT_ID, projectIdFromUrl);
      }

      window.dispatchEvent(new CustomEvent('apiKeyUpdated', { detail: { apiKey: apiKeyFromUrl } }));
      
      // Clean URL (remove query params from address bar for cleaner look)
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);
};

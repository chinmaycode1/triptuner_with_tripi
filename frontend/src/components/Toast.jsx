import { useEffect, useState } from 'react';
import './Toast.css';

let toastQueue = [];
let listeners = [];

export function showToast(message, type = 'info') {
  const id = Date.now() + Math.random();
  const toast = { id, message, type };
  toastQueue = [...toastQueue, toast];
  listeners.forEach(fn => fn([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(fn => fn([...toastQueue]));
  }, 3500);
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter(fn => fn !== setToasts); };
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          <span className="toast-icon">{icons[t.type] || icons.info}</span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

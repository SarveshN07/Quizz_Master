import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

const splash = document.getElementById("splash");
if (splash) {
  // Wait 2 seconds (2000ms) before starting fade-out
  setTimeout(() => {
    splash.classList.add("fade-out");
    // Remove splash after fade-out transition (0.8s)
    setTimeout(() => splash.remove(), 800);
  }, 2000);
}

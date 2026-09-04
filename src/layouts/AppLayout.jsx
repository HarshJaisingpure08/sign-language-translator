import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * AppLayout — wraps authenticated/app pages with persistent navbar.
 */
export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
        {children}
      </main>
    </div>
  );
}

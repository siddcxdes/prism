import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

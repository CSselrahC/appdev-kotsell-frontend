import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside className="bg-dark text-white p-3" style={{ width: 220, minHeight: '100vh' }}>
        <h4 className="mb-4">Docker Admin</h4>
        <nav className="nav flex-column">
          <Link to="/admin" className="nav-link text-white">Dashboard</Link>
          <Link to="/admin/products" className="nav-link text-white">Products</Link>
          {/* add more links later (Orders, Users, etc.) */}
        </nav>
        <button
          className="btn btn-outline-light mt-4 w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

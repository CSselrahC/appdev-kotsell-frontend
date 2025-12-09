import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminAddProduct from './admin/AdminAddProduct';
import AdminEditProducts from './admin/AdminEditProducts';
import AdminEditProductDetails from './admin/AdminEditProductDetails';
import AdminAccount from './admin/AdminAccount';

function AdminRoutes({ transactions, usedCoupons }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<AdminLayout />}
      >
        <Route index element={<AdminDashboard transactions={transactions} usedCoupons={usedCoupons} />} />
        
        {/* Add Products */}
        <Route path="products/add" element={<AdminAddProduct />} />
        
        {/* Edit Products */}
        <Route path="products/edit" element={<AdminEditProducts />} />
        <Route path="products/edit/:id" element={<AdminEditProductDetails />} />
        
        {/* Account Settings */}
        <Route path="account" element={<AdminAccount />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/admin/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AllBooksPage = lazy(() => import('./pages/AllBooksPage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowAdmin={false}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowAdmin={false}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-books"
          element={
            <ProtectedRoute allowAdmin={false}>
              <AllBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute allowAdmin={false}>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AllBooksPage = lazy(() => import('./pages/AllBooksPage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/all-books" element={<AllBooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
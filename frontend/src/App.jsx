import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import CertificatePage from './pages/CertificatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Standard Layout with Sticky Navbar and Footer
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<CatalogPage />} />
            <Route path="/course/:slug" element={<CourseDetailsPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Focused Fullscreen Player View */}
          <Route path="/learn/:slug" element={<LearningPlayerPage />} />

          {/* Focused Quiz View */}
          <Route
            path="/quiz/:courseId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* Printable Official Certificate View */}
          <Route path="/certificate/:certificateId" element={<CertificatePage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

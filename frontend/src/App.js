import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import Dashboard from './components/dashboard/Dashboard';
import ReviewCaseList from './components/cases/ReviewCaseList';
import ReviewCaseDetails from './components/cases/ReviewCaseDetails';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Footer from './components/layout/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import VerifyUsername from './components/VerifyUsername';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import QuickActions from './components/QuickActions';

const AppContent = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Container
        maxWidth={isLanding ? false : 'lg'}
        disableGutters={isLanding}
        sx={{ mt: isLanding ? 0 : { xs: 2, md: 4 }, mb: isLanding ? 0 : { xs: 3, md: 4 }, px: isLanding ? 0 : { xs: 2, sm: 3 } }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute><ReviewCaseList /></ProtectedRoute>} />
          <Route path="/cases/:id" element={<ProtectedRoute><ReviewCaseDetails /></ProtectedRoute>} />
          <Route path="/verify-username" element={<VerifyUsername />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      <QuickActions />
      <Footer />
    </>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppContent />
    </Router>
  </ThemeProvider>
);

export default App;

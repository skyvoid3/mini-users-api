import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage'; // Optional 404 page
import { PrivateRoute, PrivateWrapper, PublicRoute } from './routes/AuthRoute';
import MainLayout from './routes/MainLayout';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* All routes wrapped in MainLayout (with Navbar) */}
                <Route element={<MainLayout />}>
                    {/* Public pages */}
                    <Route path="/" element={<LandingPage />} />

                    <Route element={<PublicRoute />}>
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>

                    {/* Protected pages */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<PrivateWrapper />}>
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                    </Route>

                    {/* 404 fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

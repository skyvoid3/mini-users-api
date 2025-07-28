import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignupForm from './pages/Signup';
import LoginForm from './pages/Login';

export default function App() {
    return (
        <Routes>
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
        </Routes>
    );
}

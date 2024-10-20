import React, { useState } from 'react';
import Input from '../components/shared/Input.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        try {
            await login(email, password);
            navigate("/profile");
        } catch (error) {
            console.error("Login failed:", error);
            setLoginError("Invalid email or password. Please try again.");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-adp-gray">
            <div className="card-filled p-large rounded-lg shadow-lg w-96">
                <h1 className="text-xl text-adp-navy text-center mb-large">Log In to the portal</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-medium">
                    <Input
                        name="Email"
                        placeholder="Introduce your email"
                        type="email"
                        error={loginError}
                        isTextArea={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        name="Password"
                        placeholder="Introduce your password"
                        type="password"
                        error={loginError}
                        isTextArea={false}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary mt-medium">
                        Log In
                    </button>

                    {loginError && (
                        <div className="mt-small text-danger">{loginError}</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
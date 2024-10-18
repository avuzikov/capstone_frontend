import React, { useState } from 'react';
import Input from '../components/shared/Input.tsx'
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) =>{
        alert("Try to log")
        console.log(email)
        console.log(password)
        navigate("/profile")
        //TODO: Login logic
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
                <div className="mt-small text-danger">{loginError}</div>)}

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
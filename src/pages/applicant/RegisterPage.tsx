// src\pages\applicant\RegisterPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import RegisterForm from '../../components/applicant/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px-56px)]">
      <div className="flex flex-col items-center mx-auto card-filled bg-adp-gray w-[28rem]">
        <RegisterForm />
        <p className="text-adp-navy">
          Already registered? Go to{' '}
          <Link className="underline text-adp-navy-dark hover:text-adp-navy-light" to="/login">
            sing in page.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

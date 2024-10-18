import React, { useState } from 'react';
import Input from '../shared/Input';

const LoginForm: React.FC = () => {

    return (
        <div>
            <Input title={"hola"} isTextArea={false} placeholder={"hola"} type={"password"} error={"error"}></Input>
        </div>
    );
}

export default LoginForm;
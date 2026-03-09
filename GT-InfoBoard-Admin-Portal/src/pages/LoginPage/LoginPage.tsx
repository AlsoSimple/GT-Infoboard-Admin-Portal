import style from './LoginPage.module.scss'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//fjern udkommentering når router er sat op, og tilføj import for useNavigate

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = 'http://localhost:5001/auth/login'; // adjust port/path as needed
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    console.log('Login response:', data);
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/home');
    } else {
      // Handle login failure (e.g., show error message)
      alert('Login failed: ' + (data.message || 'Unknown error'));
    }
  };

  return (
    <div className={style.loginPage}>
      <div className={style.loginBox}>
        <div className={style.loginTitle}>Log in</div>
        <form onSubmit={handleSubmit}>
          <input className={style.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="User" />
          <input className={style.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button className={style.button} type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
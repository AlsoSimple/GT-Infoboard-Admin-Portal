import style from "./LoginPage.module.scss";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const { data, isLoading, error, post } = usePost(
    "https://gt-infoboardapi-production.up.railway.app/auth/login",
  );

  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      navigate("/home");
    } else if (data && !data.token) {
      alert("Login failed: " + (data.message || "Unknown error"));
    }
    if (error) {
      alert("Login failed: " + error);
    }
  }, [data, error, navigate]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    post({ username, password });
  };

  return (
    <div className={style.loginPage}>
      <div className={style.loginBox}>
        <div className={style.loginTitle}>Log in</div>
        <form className={style.loginForm} onSubmit={handleSubmit}>
          <input
            className={style.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="User"
          />
          <input
            className={style.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className={style.button} type="submit" disabled={isLoading}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

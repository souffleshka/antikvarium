import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем предыдущие ошибки

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      /* Get data after fetching */
      const data = await response.json();

      if (response.ok) {
        // Успешный вход
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        // Ошибка входа
        setError(data.message || "Ошибка входа");
      }
    } catch (err) {
      console.log("Login failed", err.message);
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Почта или логин"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>
        <Link to="/register">Еще нет аккаунта? Создайте здесь</Link>
      </div>
    </div>
  );
};

export default LoginPage;

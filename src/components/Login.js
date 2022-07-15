import React from 'react';
import { withRouter } from 'react-router-dom';

function Login() {

  return(
    <div className="authorization">
      <h2 className="authorization__title">Вход</h2>
      <form className="authorization__form" name="login" noValidate>
        <input 
          className="authorization__input" 
          type="email"
          name="email"
          id="login-email" 
          required
          placeholder="Email"
        />      
        <input 
          className="authorization__input" 
          type="password"
          name="password"
          id="login-password" 
          required
          placeholder="Пароль" 
        />
        <button 
          className="authorization__submit-button" 
          type="submit">
          Войти
        </button>
      </form>
    </div>
  )
}

export default Login;
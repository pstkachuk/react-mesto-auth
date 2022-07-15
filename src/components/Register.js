import { Link } from 'react-router-dom';

function Register() {

  return(
    <div className="authorization">
      <h2 className="authorization__title">Регистрация</h2>
      <form className="authorization__form" name="register" noValidate>
        <input 
          className="authorization__input" 
          type="email"
          name="email"
          id="register-email" 
          required
          placeholder="Email"
        />      
        <input 
          className="authorization__input" 
          type="password"
          name="password"
          id="register-password" 
          required
          placeholder="Пароль" 
        />
        <button 
          className="authorization__submit-button" 
          type="submit">
          Зарегистрироваться
        </button>
      </form>
      <Link to='/sign-in' className="authorization__link">
        Уже зарегистрированны? Войти
      </Link>
    </div>
  )
}

export default Register;
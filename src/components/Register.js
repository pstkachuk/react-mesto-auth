import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({onRegister}) {
  const [inputsValues, setInputsValues] = useState({
    email: '',
    password: ''
  })

  function handleChange(evt) {
    const {name, value} = evt.target
    setInputsValues({...inputsValues, [name]: value})
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(inputsValues.email, inputsValues.password);
  }
 

  return(
    <div className="authorization">
      <h2 className="authorization__title">Регистрация</h2>
      <form 
        className="authorization__form" 
        name="register" 
        noValidate
        onSubmit={handleSubmit}>
        <input 
          className="authorization__input" 
          type="email"
          name="email"
          id="register-email" 
          required
          placeholder="Email"
          onChange={handleChange}
          value={inputsValues.email || ''}
        />      
        <input 
          className="authorization__input" 
          type="password"
          name="password"
          id="register-password" 
          required
          placeholder="Пароль" 
          onChange={handleChange}
          value={inputsValues.password || ''}
        />
        <button 
          className="authorization__submit-button" 
          type="submit">
          Зарегистрироваться
        </button>
      </form>
      <Link to='./sign-in' className="authorization__link">
        Уже зарегистрированны? Войти
      </Link>
    </div>
  )
}

export default Register;
import { useState } from 'react';

function Login({onLogin}) {
  const [inputsValues, setInputsValues] = useState({
    email: '',
    password: ''
  })

  function handleChange(evt) {
    const { name, value} = evt.target;
    setInputsValues({...inputsValues, [name]: value})
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(inputsValues.email, inputsValues.password)
  }

  return(
    <div className="authorization">
      <h2 className="authorization__title">Вход</h2>
      <form 
        className="authorization__form" 
        name="login"
        noValidate
        onSubmit={handleSubmit}>
        <input 
          className="authorization__input" 
          type="email"
          name="email"
          id="login-email" 
          required
          placeholder="Email"
          onChange={handleChange}
          value={inputsValues.email || ''}
        />      
        <input 
          className="authorization__input" 
          type="password"
          name="password"
          id="login-password" 
          required
          placeholder="Пароль" 
          onChange={handleChange}
          value={inputsValues.password || ''}
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
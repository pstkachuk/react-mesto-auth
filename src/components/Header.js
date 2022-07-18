import headerLogo from '../images/header-logo.svg';
import { Switch, Route, Link } from 'react-router-dom';

function Header({userEmail, onSignOut}) {
  return(
    <header className="header">
      <img src={headerLogo} alt="Логотип Место" className="header__logo" />
      <Switch>
        <Route path='/signin'>
          <Link to='/signup' className="header__link">
            Регистрация
          </Link>
        </Route>
        <Route path='/signup'>
          <Link to='/signin' className="header__link">
            Войти
          </Link>
        </Route>
        <Route path='/'>
          <div className="header__email-container">
            <span className="header__email">{userEmail}</span>
            <Link 
              to='/signin' 
              className="header__link header__link_exit"
              onClick={onSignOut}>
             Выйти
            </Link>
          </div>
        </Route>
      </Switch>
    </header>
  )
}

export default Header;
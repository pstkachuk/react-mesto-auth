import headerLogo from '../images/header-logo.svg';
import { Switch, Route, Link } from 'react-router-dom';

function Header({userEmail}) {
  return(
    <header className="header">
      <img src={headerLogo} alt="Логотип Место" className="header__logo" />
      <Switch>
        <Route path='/sign-in'>
          <Link to='/sign-up' className="header__link">
            Регистрация
          </Link>
        </Route>
        <Route path='/sign-up'>
          <Link to='/sign-in' className="header__link">
            Войти
          </Link>
        </Route>
      </Switch>
    </header>
  )
}

export default Header;
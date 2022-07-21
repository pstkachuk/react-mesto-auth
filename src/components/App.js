import { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import api from '../utils/Api';
import auth from '../utils/Auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import succesImage from '../images/success.svg';
import failImage from '../images/fail.svg';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);    
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = useState(false);  //информационное окно
  const [deletionCard, setDeletionCard] = useState({});   // стейт удаляемой карточки
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);      //стейт индикатора загрузки запросов
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tooltip, setTooltip] = useState({});   //данные для окна с сообщением
  const history = useHistory();

  useEffect(() => {   //запрос данных пользователя
    api.getUserInfo()
    .then(setCurrentUser)
    .catch((err) => {
      console.log(err);
    })
  }, [])

  useEffect(() => {   //запрос карточек
    api.getCards()
    .then(setCards)
    .catch((err) => {
      console.log(err);
    })
  }, [])

  useEffect(() => {
    handleTokenCheck();
  }, [])

  function handleSetCardsState(card) {
    setCards((state) => state.map((cardItem) => cardItem._id === card._id ? card : cardItem));
  }  

  function handleCardLike(card) {     //поставить/убрать лайк
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    if (isLiked) {
      api.deleteLike(card._id)
      .then(handleSetCardsState)
      .catch((err) => {
        console.log(err);
      })
    } else {
      api.like(card._id)
      .then(handleSetCardsState)
      .catch((err) => {
        console.log(err);
      })
    }
  } 

  function handleCardDelete() {   //удалить карточку
    setIsLoading(true);
    api.deleteCard(deletionCard._id)
    .then(() => {
      setCards(cards.filter((item) => item._id !== deletionCard._id))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setIsLoading(false);
      closeAllPopups();
    });
  }

  function handleEditAvatarClick() {    //открыть окно добавления аватара
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {   //открыть окно редактирования профиля
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {    //открыть окно добавления карточки
    setIsAddPlacePopupOpen(true);
  }

  function handleOpenConfirmPopup(card) {   //открыть окно подтверждения удаления карточки
    setDeletionCard(card);
    setIsConfirmPopupOpen(true);
  }

  function closeAllPopups() {   //закрыть все окна
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setIsTooltipPopupOpen(false);
    setSelectedCard({});
    setDeletionCard({});
  }

  function handleCardClick(card) {    //открыть попап с картинкой
    setSelectedCard(card);
  }

  function handleUpdateUser(userData) {   //установить данные пользователя
    setIsLoading(true);
    api.setUserInfo(userData.name, userData.about)
    .then(setCurrentUser)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setIsLoading(false);
      closeAllPopups(); 
    });
  }

  function handleUpdateAvatar(userData) {   //запрос на обновление аватара
    setIsLoading(true);
    api.setAvatar(userData.avatar)
    .then(setCurrentUser)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setIsLoading(false);
      closeAllPopups(); 
    });
  }

  function handleAddPlaceSubmit(cardData) {   //добавить карточку
    setIsLoading(true);
    api.addNewCard(cardData.name, cardData.link)
    .then((newCard) => {
      setCards([newCard, ...cards])
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setIsLoading(false);
      closeAllPopups(); 
    });
  }

  function handleEscClose(evt) {    //закрыть на ESC
    evt.key === 'Escape' && closeAllPopups();
  }

  function handleRegister(email, password) {   //запрос на регистрацию
    auth.registration(email, password)
    .then((res) => {
      if (res) {
        setTooltip({
          image: succesImage,
          message: "Вы успешно зарегистрировались!"
        })
        history.push('/signin')
      }
    })
    .catch((err) => {
      console.log(err);
      setTooltip({
        image: failImage,
        message: "Что-то пошло не так! Попробуйте ещё раз."
      })
    })
    .finally(() => {
      setIsTooltipPopupOpen(true);
    })
  }

  function handleLogin(email, password) {   //запрос на авторизацию
    auth.authorization(email, password)
    .then((res) => {
      if (res.token) {
        setLoggedIn(true);
        localStorage.setItem('token', res.token);
        setUserEmail(email);
        history.push('/')
      }
    })
    .catch((err) => {
      console.log(err);
      setTooltip({
        image: failImage,
        message: "Что-то пошло не так! Попробуйте ещё раз."
      })
      setIsTooltipPopupOpen(true);
    })
  }

  function handleTokenCheck() {   //проверка токена
    const token = localStorage.getItem('token');
    if (token) {
      auth.tokenCheck(token)
      .then((res) => {
        setLoggedIn(true);
        setUserEmail(res.data.email);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  function handleSignOut() {    //выход
    localStorage.removeItem('token');
    setUserEmail('')
    history.push('/signin');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        (
        <Header 
          userEmail={userEmail} 
          onSignOut={handleSignOut}
          loggedIn={loggedIn}
        />

        <Switch>
          <ProtectedRoute
              exact 
              path="/"
              component={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleOpenConfirmPopup}
            />

          <Route path="/signup">
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/signin">
            <Login onLogin={handleLogin}/>
          </Route> 

          <Route>{loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}</Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
          onEscapeClose={handleEscClose}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
          onEscapeClose={handleEscClose}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
          onEscapeClose={handleEscClose}
        />

        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
          isLoading={isLoading}
          onEscapeClose={handleEscClose}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onEscapeClose={handleEscClose}
        />

        <InfoTooltip 
          isOpen={isTooltipPopupOpen}
          onClose={closeAllPopups}
          tooltip={tooltip}
        />
        )
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
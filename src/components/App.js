import { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
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
  const [deletionCard, setDeletionCard] = useState({});   // стейт удаляемоё карточки
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);      //стейт индикатора загрузки запросов
  const [loggedIn, setLoggedIn] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      history.push('/')
    }
  }, [loggedIn])

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
        history.push('/sign-in')
      }
    })
    .catch((err) => {
      console.log(err);
    })

  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        (
        <Header />

        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleOpenConfirmPopup}
          />

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            <Login />
          </Route>

          <Route exact path='/'>
            { loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' /> }
          </Route>
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

        <InfoTooltip />
        )
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
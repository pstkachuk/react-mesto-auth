class Auth {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl;
  }

  _requestIsOk(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка - ${res.status}`);
  }

  registration(email, password) {
    return fetch(
      `${this._baseUrl}/signup`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )
    .then(this._requestIsOk);
  }
}

const auth = new Auth({baseUrl: 'https://auth.nomoreparties.co'});

export default auth;
export class User {
  _loggedIn: boolean;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(bool) {
    this._loggedIn = bool;
  }

  constructor() {
    this._loggedIn = false;
  }
}

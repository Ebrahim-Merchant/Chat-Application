export class AuthGaurd {

  static isAuthenticated: any;
  static userId: any;
  constructor(isAuthenticated, userId) {
    AuthGaurd.isAuthenticated = isAuthenticated;
    AuthGaurd.userId = userId;
    sessionStorage.setItem('isAuthenticated', String(isAuthenticated))
    sessionStorage.setItem('userId', String(userId))
  }

  static authenticate(userId) {
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userId', userId);
    return AuthGaurd.isAuthenticated;
  }

  static isUserAuthenticated() {
    const isAuth = sessionStorage.getItem('isAuthenticated');
    return Boolean(isAuth);
  }

  static getUserId() {
    const userId = sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : AuthGaurd.userId;
    return userId;
  }
  static signout() {
    sessionStorage.clear();
  }
};

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(signupForm: any): Observable<any> {
    return this.http.post<any>(AUTH_API + '/signup', signupForm);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      AUTH_API + '/signin',
      {
        email: username,
        password: password,
      },
      { withCredentials: true }
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + '/signout', {});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      AUTH_API + '/forgot-password?email=' + email,
      {}
    );
  }

  resetPassword(
    token: string | null,
    newPassword: string,
    email: string | null
  ): Observable<any> {
    return this.http.post<any>(AUTH_API + '/reset-password', {
      token,
      newPassword,
      email,
    });
  }
}

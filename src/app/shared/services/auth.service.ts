import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

const AUTH_API = 'http://localhost:8080/api/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(signupForm: any): Observable<any> {
    return this.http.post<any>(AUTH_API + '/signup', signupForm);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(AUTH_API + '/signin', {
      email: username,
      password: password,
    });
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + '/signout', {});
  }
}

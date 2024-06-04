import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private http: HttpClient) {}

  signup(signupForm: any): Observable<any> {
    return this.http.post<any>(AUTH_API + '/signup', signupForm, httpOptions);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      AUTH_API + '/signin',
      {
        email: username,
        password: password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + '/signout', { }, httpOptions);
  }
}

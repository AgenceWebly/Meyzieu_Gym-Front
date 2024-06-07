import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../../models/member.model';

const AUTH_API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCurrentUserDataFromApi(currentUserId: number): Observable<any> {
    return this.http.get<any>(`${AUTH_API}/users/${currentUserId}`);
  }

  updateUser(updatedUser: any, userId: number): Observable<any> {
    return this.http.put<any>(`${AUTH_API}/users/${userId}`, updatedUser);
  }

  getMembers(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${AUTH_API}/users/${userId}/members`);
  }

  createMember(userId: number, newMember: any) {
    return this.http.post<any>(AUTH_API + '/users/' + userId + '/members', newMember);
  }

}
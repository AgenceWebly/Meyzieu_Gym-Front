import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.post<any>(
      AUTH_API + '/users/' + userId + '/members',
      newMember
    );
  }

  // S E A S O N S
  getSeasons(): Observable<any[]> {
    return this.http.get<any[]>(`${AUTH_API}/seasons`);
  }

  getSeasonById(seasonId: number): Observable<any> {
    return this.http.get<any>(`${AUTH_API}/seasons/${seasonId}`);
  }

  createSeason(newSeason: any): Observable<any> {
    return this.http.post<any>(`${AUTH_API}/seasons`, newSeason);
  }

  updateSeason(updatedSeason: any, seasonId: number): Observable<any> {
    return this.http.put<any>(`${AUTH_API}/seasons/${seasonId}`, updatedSeason);
  }

  // P R O G R A M S
  getPrograms(): Observable<any[]> {
    return this.http.get<any[]>(`${AUTH_API}/programs`);
  }

  getProgramById(programId: number): Observable<any> {
    return this.http.get<any>(`${AUTH_API}/programs/${programId}`);
  }

  createProgram(newProgram: any): Observable<any> {
    return this.http.post<any>(`${AUTH_API}/programs`, newProgram);
  }

  updateProgram(updatedProgram: any, programId: number): Observable<any> {
    return this.http.put<any>(
      `${AUTH_API}/programs/${programId}`,
      updatedProgram
    );
  }

  // U S E R S
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${AUTH_API}/admin/users`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${AUTH_API}/admin/users/${userId}`);
  }
}

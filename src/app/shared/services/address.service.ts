import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = environment.banUrl;

  constructor(private http: HttpClient) { }

  searchAddress(query: string): Observable<any> {
    const params = { q: query,lat: 45.766821, lon: 5.003658 };
    return this.http.get(this.apiUrl, { params });
  }
}

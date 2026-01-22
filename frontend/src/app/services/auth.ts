import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';


interface AuthResponse {
  message: String,
  details?: String[]
}

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private apiUrl = `${environment.apiUrl}/auth/register`;

  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post<AuthResponse>(this.apiUrl, userData);
  }
}

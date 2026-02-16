import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { tap } from 'rxjs';


interface AuthResponse {
  status: string,
  message: string,
  token?: string,
  user?: {
    id: Number,
    username: string,
    role: string
  },
  details?: string[]
}

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;


  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        window.dispatchEvent(new Event('userUpdated'));
      })
    )
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

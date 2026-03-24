import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organizacion: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  usuario: {
    _id: string;
    name: string;
    email: string;
    organizacion: string;
  };
}

export interface Usuario {
  _id: string;
  name: string;
  email: string;
  organizacion: any;
}

const TOKEN_KEY = 'jwt_token';
const API_URL = 'http://localhost:1337';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${API_URL}/usuarios`, payload).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => {
        this.saveToken(res.accessToken);
      })
    );
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, payload, { withCredentials: true }).pipe(
      tap((res) => {
        this.saveToken(res.accessToken);
        this.router.navigate(['/home']);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];           // el JWT tiene 3 partes: header.payload.signature
      const decoded = atob(payload);                 // base64 → string JSON
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    return this.decodeToken()?.role ?? null;
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_URL}/usuarios`);
  }

  logout(): void {
    this.http.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {},
      error: () => {}
    });

    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
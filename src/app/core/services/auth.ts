import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id:           string;
  name:         string;
  email:        string;
  role:         'COMPANY' | 'CUSTOMER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private _user  = signal<AuthUser | null>(null);
  private _token = signal<string | null>(null);
  
  private apiUrl       = environment.apiUrl.company

  isLoggedIn   = computed(() => !!this._token());
  currentUser  = computed(() => this._user());
  token        = computed(() => this._token());
  companyName  = computed(() =>
    this._user()?.name ?? 'اسم الشركة'
  );
  userName     = computed(() =>
    this._user()?.name ?? 'المستخدم'
  );

  constructor() {
    const savedToken = localStorage.getItem(
      'company_token'
    );
    const savedUser  = localStorage.getItem(
      'company_user'
    );

    if (savedToken) {
      this._token.set(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && typeof parsedUser === 'object') {
          this._user.set(parsedUser);
        } else {
          localStorage.removeItem('company_user');
        }

      } catch (e) {
        console.warn('Invalid user JSON in localStorage');
        localStorage.removeItem('company_user');
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<{
      token: string;
      user:  AuthUser;
      message: string;
    }>(
      `${this.apiUrl}/auth/post-login`,
      { email, password }
    );
  } 

  register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post<{
      token: string;
      user: AuthUser;
      message: string;
    }>(
      `${this.apiUrl}/users/post-user`,
      data
    );
  }

  setSession(token: string, user: AuthUser): void {
    this._token.set(token);
    this._user.set(user);
    localStorage.setItem('company_token', token);
    localStorage.setItem(
      'company_user', JSON.stringify(user)
    );
  }

  logout(): void {
    const token = this._token();
    if (token) {
      this.http.post(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({ error: () => {} });
    }
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('company_token');
    localStorage.removeItem('company_user');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
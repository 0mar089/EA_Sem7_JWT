import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tokenPreview = '';
  usuarios: Usuario[] = [];
  loadingUsuarios = false;
  errorUsuarios = '';
  isAdmin = false; // 👈 nuevo

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken() || '';
    this.tokenPreview = token;
    this.isAdmin = this.authService.hasRole('admin'); // 👈 nuevo
  }

  logout(): void {
    this.authService.logout();
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']); // 👈 nuevo
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    this.errorUsuarios = '';

    this.authService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.loadingUsuarios = false;
      },
      error: (err: any) => {
        this.errorUsuarios = err.error?.message || 'Error al cargar usuarios';
        this.loadingUsuarios = false;
      }
    });
  }

  refreshToken(): void {
    this.authService.refreshToken().subscribe({
      next: (res: { accessToken: string }) => {
        this.tokenPreview = res.accessToken;
        this.isAdmin = this.authService.hasRole('admin'); // 👈 recomprobamos tras refresh
        alert('Token refrescado correctamente. Revisa la consola para comparar.');
      },
      error: (err: any) => {
        this.errorUsuarios = err.error?.message || 'Error al refrescar el token';
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Organizacion {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  organizaciones: Organizacion[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOrganizaciones();
  }

  cargarOrganizaciones(): void {
    this.loading = true;
    this.error = '';

    this.http.get<Organizacion[]>('http://localhost:1337/organizaciones').subscribe({
      next: (data) => {
        this.organizaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar organizaciones';
        this.loading = false;
      }
    });
  }

  eliminarOrganizacion(id: string): void {
    if (!confirm('¿Seguro que quieres eliminar esta organización?')) return;

    this.http.delete(`http://localhost:1337/organizaciones/${id}`).subscribe({
      next: () => {
        this.organizaciones = this.organizaciones.filter(o => o._id !== id);
        this.successMessage = 'Organización eliminada correctamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar organización';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MCAuthBasicComponent, MCAuthBasicConfig, MCAuthModel } from '@mckit/auth';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MCAuthBasicComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  config = new MCAuthBasicConfig();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadConfig();
    
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  loadConfig() {
    this.config.title = 'Inicio de sesión';
    this.config.subtitle = 'Por favor, inicie sesión para continuar';
    this.config.emailPlaceholder = 'Correo electrónico';
    this.config.passwordPlaceholder = 'Contraseña';
    this.config.submitButton = 'Iniciar sesión';
    this.config.resetPassword = '¿Olvidaste tu contraseña?';
    this.config.resetPasswordLink = '/reset-password';
    this.config.register = '¿No tienes una cuenta?';
    this.config.registerLink = '/register';
  }

  onLogin(data: MCAuthModel) {
    this.authService.login(data.email ?? '', data.password ?? '').subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.notificationService.showSuccess('Login exitoso', 'Bienvenido de nuevo');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        const message = error.error?.message || 'Error al iniciar sesión';
        this.notificationService.showError('Error de autenticación', message);
      }
    });
  }
}



import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const passwordConfirmation = form.get('password_confirmation');
    
    if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
      passwordConfirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      this.authService.register(
        formValue.name,
        formValue.email,
        formValue.password,
        formValue.password_confirmation
      ).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Registro exitoso', 'Bienvenido');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al registrarse';
          const errors = error.error?.errors;
          if (errors) {
            const errorMessages = Object.values(errors).flat().join(', ');
            this.notificationService.showError('Error de registro', errorMessages);
          } else {
            this.notificationService.showError('Error de registro', message);
          }
        }
      });
    } else {
      this.notificationService.showWarning('Formulario inválido', 'Por favor complete todos los campos correctamente');
    }
  }
}


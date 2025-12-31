import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpaceService } from '../../../services/space.service';
import { ReservationService } from '../../../services/reservation.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Space } from '../../../models/space.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  space: Space | null = null;
  loading = false;
  spaceId!: number;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private spaceService: SpaceService,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    }, { validators: this.timeValidator });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showWarning('Autenticación requerida', 'Debes iniciar sesión para reservar');
      this.router.navigate(['/login']);
      return;
    }

    this.spaceId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSpace();
  }

  timeValidator(form: FormGroup) {
    const startTime = form.get('start_time')?.value;
    const endTime = form.get('end_time')?.value;

    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (end <= start) {
        form.get('end_time')?.setErrors({ invalidTime: true });
        return { invalidTime: true };
      }

      if (start < new Date()) {
        form.get('start_time')?.setErrors({ pastDate: true });
        return { pastDate: true };
      }
    }

    return null;
  }

  loadSpace() {
    this.loading = true;
    this.spaceService.getSpace(this.spaceId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.space = response.data.space;
          if (!this.space?.is_active) {
            this.notificationService.showError('Espacio no disponible', 'Este espacio no está disponible para reservas');
            this.router.navigate(['/spaces', this.spaceId]);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'No se pudo cargar el espacio');
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    if (this.reservationForm.valid && this.space) {
      const formValue = this.reservationForm.value;
      
      // Formatear fechas para el backend
      const startTime = new Date(formValue.start_time).toISOString().slice(0, 19).replace('T', ' ');
      const endTime = new Date(formValue.end_time).toISOString().slice(0, 19).replace('T', ' ');

      this.reservationService.createReservation({
        space_id: this.space.id,
        title: formValue.title,
        description: formValue.description || '',
        start_time: startTime,
        end_time: endTime
      }).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Reserva creada', 'Tu reserva ha sido creada exitosamente');
            this.router.navigate(['/reservations']);
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al crear la reserva';
          const errors = error.error?.errors;
          if (errors) {
            const errorMessages = Object.values(errors).flat().join(', ');
            this.notificationService.showError('Error', errorMessages);
          } else {
            this.notificationService.showError('Error', message);
          }
        }
      });
    } else {
      this.notificationService.showWarning('Formulario inválido', 'Por favor complete todos los campos correctamente');
    }
  }
}



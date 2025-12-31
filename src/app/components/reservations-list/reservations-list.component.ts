import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../services/reservation.service';
import { NotificationService } from '../../../services/notification.service';
import { Reservation } from '../../../models/space.model';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.scss'
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading = false;
  showEditDialog = false;
  editingReservation: Reservation | null = null;
  statusFilter = '';

  constructor(
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservations = response.data.reservations;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'No se pudieron cargar las reservas');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredReservations = this.reservations.filter(reservation => {
      if (this.statusFilter && reservation.status !== this.statusFilter) {
        return false;
      }
      return true;
    });
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  editReservation(reservation: Reservation) {
    this.editingReservation = { ...reservation };
    this.showEditDialog = true;
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editingReservation = null;
  }

  saveReservation() {
    if (!this.editingReservation) return;

    const startTime = new Date(this.editingReservation.start_time).toISOString().slice(0, 19).replace('T', ' ');
    const endTime = new Date(this.editingReservation.end_time).toISOString().slice(0, 19).replace('T', ' ');

    this.reservationService.updateReservation(this.editingReservation.id, {
      title: this.editingReservation.title,
      description: this.editingReservation.description,
      start_time: startTime,
      end_time: endTime,
      status: this.editingReservation.status
    }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.notificationService.showSuccess('Éxito', 'Reserva actualizada correctamente');
          this.loadReservations();
          this.cancelEdit();
        }
      },
      error: (error) => {
        const message = error.error?.message || 'Error al actualizar la reserva';
        this.notificationService.showError('Error', message);
      }
    });
  }

  cancelReservation(reservation: Reservation) {
    if (confirm(`¿Está seguro de cancelar la reserva "${reservation.title}"?`)) {
      this.reservationService.updateReservation(reservation.id, {
        status: 'cancelled'
      }).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Éxito', 'Reserva cancelada correctamente');
            this.loadReservations();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al cancelar la reserva';
          this.notificationService.showError('Error', message);
        }
      });
    }
  }

  deleteReservation(reservation: Reservation) {
    if (confirm(`¿Está seguro de eliminar la reserva "${reservation.title}"? Esta acción no se puede deshacer.`)) {
      this.reservationService.deleteReservation(reservation.id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Éxito', 'Reserva eliminada correctamente');
            this.loadReservations();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al eliminar la reserva';
          this.notificationService.showError('Error', message);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  }

  formatDateTimeForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}


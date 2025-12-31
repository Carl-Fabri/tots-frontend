import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpaceService } from '../../../services/space.service';
import { ReservationService } from '../../../services/reservation.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Space, Reservation } from '../../../models/space.model';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarViewComponent],
  templateUrl: './space-detail.component.html',
  styleUrl: './space-detail.component.scss'
})
export class SpaceDetailComponent implements OnInit {
  space: Space | null = null;
  reservations: Reservation[] = [];
  loading = false;
  spaceId!: number;

  constructor(
    public  route: ActivatedRoute,
    public router: Router,
    private spaceService: SpaceService,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.spaceId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSpace();
    this.loadReservations();
  }

  loadSpace() {
    this.loading = true;
    this.spaceService.getSpace(this.spaceId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.space = response.data.space;
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

  loadReservations() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    this.reservationService.getCalendarReservations(
      today.toISOString().split('T')[0],
      nextWeek.toISOString().split('T')[0],
      this.spaceId
    ).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservations = response.data.reservations;
        }
      },
      error: (error) => {
        console.error('Error loading reservations', error);
      }
    });
  }

  reserveSpace() {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showWarning('Autenticación requerida', 'Debes iniciar sesión para reservar');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/spaces', this.spaceId, 'reserve']);
  }

  isReserved(date: Date, hour: number): boolean {
    const checkDate = new Date(date);
    checkDate.setHours(hour, 0, 0, 0);
    
    return this.reservations.some(reservation => {
      const start = new Date(reservation.start_time);
      const end = new Date(reservation.end_time);
      return checkDate >= start && checkDate < end;
    });
  }
}


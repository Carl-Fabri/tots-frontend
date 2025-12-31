import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { SpaceService } from '../../../services/space.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Reservation, Space } from '../../../models/space.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  reservations: Reservation[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent implements OnInit {
  @Input() spaceId?: number;
  
  currentDate = new Date();
  selectedDate = new Date();
  calendarDays: CalendarDay[] = [];
  reservations: Reservation[] = [];
  spaces: Space[] = [];
  selectedSpaceId: number | null = null;
  loading = false;
  
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(
    private reservationService: ReservationService,
    private spaceService: SpaceService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.spaceId) {
      this.selectedSpaceId = this.spaceId;
    }
    this.loadSpaces();
    this.loadCalendar();
  }

  loadSpaces() {
    this.spaceService.getSpaces(true).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.spaces = response.data.spaces;
        }
      },
      error: (error) => {
        console.error('Error loading spaces', error);
      }
    });
  }

  loadCalendar() {
    // El calendario puede mostrar información incluso sin autenticación
    // pero solo cargará si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.generateCalendar(); // Generar calendario vacío
      return;
    }

    this.loading = true;
    const startDate = this.getFirstDayOfMonth(this.currentDate);
    const endDate = this.getLastDayOfMonth(this.currentDate);

    this.reservationService.getCalendarReservations(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      this.selectedSpaceId || undefined
    ).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservations = response.data.reservations;
          this.generateCalendar();
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'No se pudieron cargar las reservas del calendario');
        this.loading = false;
      }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    this.calendarDays = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        reservations: this.getReservationsForDate(date)
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        reservations: this.getReservationsForDate(date)
      });
    }
    
    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        reservations: this.getReservationsForDate(date)
      });
    }
  }

  getReservationsForDate(date: Date): Reservation[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.reservations.filter(reservation => {
      const startDate = new Date(reservation.start_time).toISOString().split('T')[0];
      const endDate = new Date(reservation.end_time).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.loadCalendar();
  }

  onSpaceChange() {
    this.loadCalendar();
  }

  getCurrentMonthYear(): string {
    return `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  getReservationTime(reservation: Reservation): string {
    const start = new Date(reservation.start_time);
    const end = new Date(reservation.end_time);
    return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  }

  hasReservations(day: CalendarDay): boolean {
    return day.reservations.length > 0;
  }

  getReservationCount(day: CalendarDay): number {
    return day.reservations.length;
  }
}

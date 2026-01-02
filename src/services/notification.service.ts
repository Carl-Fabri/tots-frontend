import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) { }

  showSuccess(summary: string, detail: string = '', life: number = 4000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    });
  }

  showError(summary: string, detail: string = '', life: number = 6000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    });
  }

  showInfo(summary: string, detail: string = '', life: number = 4000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    });
  }

  showWarning(summary: string, detail: string = '', life: number = 5000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    });
  }

  /**
   * Muestra una notificación persistente que requiere acción del usuario
   */
  showSticky(severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string = ''): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      sticky: true,
      closable: true
    });
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this.messageService.clear();
  }
}



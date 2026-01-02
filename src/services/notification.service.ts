import { Injectable } from '@angular/core';
import { MessageService, Message } from 'primeng/api';

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
    } as Message);
  }

  showError(summary: string, detail: string = '', life: number = 6000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    } as Message);
  }

  showInfo(summary: string, detail: string = '', life: number = 4000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    } as Message);
  }

  showWarning(summary: string, detail: string = '', life: number = 5000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
      closable: true,
      sticky: false
    } as Message);
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
    } as Message);
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this.messageService.clear();
  }
}



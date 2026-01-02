import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SpaceService } from '../../../services/space.service';
import { NotificationService } from '../../../services/notification.service';
import { Space } from '../../../models/space.model';

@Component({
  selector: 'app-admin-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule],
  templateUrl: './admin-spaces.component.html',
  styleUrl: './admin-spaces.component.scss'
})
export class AdminSpacesComponent implements OnInit {
  spaces: Space[] = [];
  loading = false;
  showDialog = false;
  editingSpace: Space | null = null;
  spaceForm: Partial<Space> = {
    name: '',
    description: '',
    capacity: 1,
    location: '',
    is_active: true
  };


  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.loading = true;
    this.spaceService.getSpaces().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.spaces = response.data.spaces;
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Alerta', 'Porfavor, inicia sesión');
        this.loading = false;
      }
    });
  }

  openDialog(space?: Space) {
    if (space) {
      this.editingSpace = space;
      this.spaceForm = { ...space };
    } else {
      this.editingSpace = null;
      this.spaceForm = {
        name: '',
        description: '',
        capacity: 1,
        location: '',
        is_active: true
      };
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingSpace = null;
    this.spaceForm = {
      name: '',
      description: '',
      capacity: 1,
      location: '',
      is_active: true
    };
  }

  saveSpace() {
    if (!this.spaceForm.name || !this.spaceForm.capacity) {
      this.notificationService.showWarning('Validación', 'Complete todos los campos requeridos');
      return;
    }

    if (this.editingSpace) {
      this.spaceService.updateSpace(this.editingSpace.id, this.spaceForm).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Éxito', 'Espacio actualizado correctamente');
            this.loadSpaces();
            this.closeDialog();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al actualizar el espacio';
          this.notificationService.showError('Error', message);
        }
      });
    } else {
      this.spaceService.createSpace(this.spaceForm).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Éxito', 'Espacio creado correctamente');
            this.loadSpaces();
            this.closeDialog();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al crear el espacio';
          this.notificationService.showError('Error', message);
        }
      });
    }
  }

  deleteSpace(space: Space) {
    if (confirm(`¿Está seguro de eliminar el espacio "${space.name}"?`)) {
      this.spaceService.deleteSpace(space.id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notificationService.showSuccess('Éxito', 'Espacio eliminado correctamente');
            this.loadSpaces();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al eliminar el espacio';
          this.notificationService.showError('Error', message);
        }
      });
    }
  }
}


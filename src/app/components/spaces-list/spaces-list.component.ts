import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../../services/space.service';
import { NotificationService } from '../../../services/notification.service';
import { Space } from '../../../models/space.model';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';

@Component({
  selector: 'app-spaces-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CalendarViewComponent],
  templateUrl: './spaces-list.component.html',
  styleUrl: './spaces-list.component.scss'
})
export class SpacesListComponent implements OnInit {
  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  loading = false;

  // Filtros
  searchTerm = '';
  minCapacity: number | null = null;
  maxCapacity: number | null = null;
  onlyActive = true;
  startDate = '';
  endDate = '';

  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.loading = true;
    this.spaceService.getSpaces(this.onlyActive).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.spaces = response.data.spaces;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'No se pudieron cargar los espacios');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredSpaces = this.spaces.filter(space => {
      // Filtro de búsqueda
      if (this.searchTerm && !space.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !space.description?.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro de capacidad mínima
      if (this.minCapacity !== null && space.capacity < this.minCapacity) {
        return false;
      }

      // Filtro de capacidad máxima
      if (this.maxCapacity !== null && space.capacity > this.maxCapacity) {
        return false;
      }

      return true;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCapacityFilterChange() {
    this.applyFilters();
  }

  onActiveFilterChange() {
    this.loadSpaces();
  }

  viewSpaceDetails(spaceId: number) {
    this.router.navigate(['/spaces', spaceId]);
  }

  clearFilters() {
    this.searchTerm = '';
    this.minCapacity = null;
    this.maxCapacity = null;
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }
}


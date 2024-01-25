import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() totalPages: number = 20;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): (number | '...')[] {
    const result: (number | '...')[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        result.push(i);
      } else if (result[result.length - 1] !== '...') {
        result.push('...');
      }
    }
    return result;
  }

  goToPage(page: number | '...'): void {
    if (page !== '...' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}

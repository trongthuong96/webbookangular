import { AfterViewInit, Directive, inject } from '@angular/core';
import { AutoScrollService } from '../services/auto.scroll.service';

@Directive({
  selector: '[appRestoreScrollPositon]',
  standalone: true
})
export class RestoreScrollPositonDirective implements AfterViewInit {
  autoScrollService = inject(AutoScrollService);

  ngAfterViewInit(): void {
    this.autoScrollService.shouldScroll.next(true);
  }
}

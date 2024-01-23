import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map, pairwise, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  wasBackButtonPressed = false;

  constructor( private router: Router ) {
    router.events.pipe(
      filter(ev => ev instanceof NavigationStart),
      map(ev => <NavigationStart>ev),
      startWith(null),
      pairwise(),
      tap()
    ).subscribe(([ev1, ev2]) => {
      if (ev2) {
        if (!ev1 || (ev2.url !== ev1.url)) {
          this.wasBackButtonPressed = ev2.navigationTrigger === 'popstate';
        }
      }
    });
  }
}

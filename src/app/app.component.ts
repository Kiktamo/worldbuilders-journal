import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routeTransition } from './shared/route-transition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  animations: [
    routeTransition
  ]
})
export class AppComponent {
  title = 'worldbuilders_journal';

  constructor(protected route: ActivatedRoute) {
  }
}

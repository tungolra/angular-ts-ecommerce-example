import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <!-- place components here -->
  <app-header></app-header>
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'store';
}

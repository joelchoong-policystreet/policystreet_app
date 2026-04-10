import { Component } from '@angular/core';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent {}


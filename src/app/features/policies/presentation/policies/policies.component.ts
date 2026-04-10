import { Component } from '@angular/core';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class PoliciesComponent {}


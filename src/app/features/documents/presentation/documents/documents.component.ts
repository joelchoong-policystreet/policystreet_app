import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppBottomNavComponent } from '../../../../shared/presentation/app-bottom-nav/app-bottom-nav.component';

type VehicleDocumentItem = {
  id: string;
  title: string;
  plate: string;
};

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [AppBottomNavComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent {
  constructor(private readonly router: Router) {}

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';
  readonly carIconSrc = '/assets/home/directions-car-ocr.svg';

  readonly vehicleDocuments: ReadonlyArray<VehicleDocumentItem> = [
    { id: 'vd1', title: 'Vehicle Grant', plate: 'VEJ1234' },
    { id: 'vd2', title: 'Vehicle Grant', plate: 'ABC8888' },
  ];

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }
}

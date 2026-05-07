import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

type VehicleOption = {
  id: string;
  plate: string;
  model: string;
  imageSrc: string;
};

@Component({
  selector: 'app-quotation-step-two',
  standalone: true,
  templateUrl: './quotation-step-two.component.html',
  styleUrl: './quotation-step-two.component.scss',
})
export class QuotationStepTwoComponent {
  constructor(private readonly router: Router) {}

  readonly logoBrandSrc = '/assets/home/PS Car Insurance Logo.svg';

  // Reusing policy vehicle data as requested.
  readonly vehicles: ReadonlyArray<VehicleOption> = [
    {
      id: 'p1',
      plate: 'VEJ1234',
      model: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      imageSrc: '/assets/home/directions-car.svg',
    },
    {
      id: 'p2',
      plate: 'QME1324',
      model: 'MAZDA CX-5 2022 GVC PLUS 2.5G HIGH 2488 6 SP AUTOMATIC CONVENTIONAL',
      imageSrc: '/assets/home/directions-car.svg',
    },
    {
      id: 'p3',
      plate: 'ABC8888',
      model: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
      imageSrc: '/assets/home/directions-car.svg',
    },
  ];

  readonly selectedVehicleId = signal<string | null>(null);
  readonly canContinue = computed(() => this.selectedVehicleId() !== null);

  goBack(): void {
    void this.router.navigate(['/quotation']);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  selectVehicle(id: string): void {
    this.selectedVehicleId.set(id);
  }

  continue(): void {
    // Next step to be implemented.
  }
}


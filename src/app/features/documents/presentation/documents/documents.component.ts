import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';

type VehicleDocumentItem = {
  id: string;
  title: string;
  plate: string;
};

type PolicyDocumentItem = {
  id: string;
  title: string;
  providerAndPlate: string;
};

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent {
  constructor(private readonly router: Router) {}

  readonly carIconSrc = '/assets/home/directions-car-ocr.svg';
  readonly deleteIconSrc = '/assets/documents/delete.svg';

  readonly vehicleDocuments: ReadonlyArray<VehicleDocumentItem> = [
    { id: 'vd1', title: 'Vehicle Grant', plate: 'VEJ1234' },
    { id: 'vd2', title: 'Vehicle Grant', plate: 'ABC8888' },
  ];

  readonly policyDocuments: ReadonlyArray<PolicyDocumentItem> = [
    { id: 'pd1', title: 'Motor Insurance Policy', providerAndPlate: 'Allianz • VEJ1234' },
    { id: 'pd2', title: 'Motor Insurance Policy', providerAndPlate: 'STMB • ABC8888' },
  ];

  goUploadDocuments(): void {
    void this.router.navigate(['/documents/upload']);
  }
}

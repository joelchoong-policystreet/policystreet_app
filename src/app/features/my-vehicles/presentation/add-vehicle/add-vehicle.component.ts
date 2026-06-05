import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, take } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [ReactiveFormsModule, CachedAssetImgDirective],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})
export class AddVehicleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    plateNo: ['', Validators.required],
    ownerFullName: ['', Validators.required],
  });

  readonly canSave = toSignal(
    this.form.valueChanges.pipe(
      map(() => this.hasRequiredValues()),
      startWith(this.hasRequiredValues()),
    ),
    { initialValue: false },
  );

  private hasRequiredValues(): boolean {
    const { plateNo, ownerFullName } = this.form.getRawValue();
    return plateNo.trim().length > 0 && ownerFullName.trim().length > 0;
  }

  goBack(): void {
    this.inAppNav.backOrNavigate(['/my-vehicles']);
  }

  onSave(): void {
    if (!this.canSave() || this.saving()) {
      return;
    }

    const { plateNo, ownerFullName } = this.form.getRawValue();
    this.saving.set(true);

    this.policyRepository
      .addVehicle({ plate: plateNo, ownerFullName })
      .pipe(take(1))
      .subscribe({
        next: () => {
          void this.router.navigate(['/my-vehicles']);
        },
        complete: () => {
          this.saving.set(false);
        },
        error: () => {
          this.saving.set(false);
        },
      });
  }
}

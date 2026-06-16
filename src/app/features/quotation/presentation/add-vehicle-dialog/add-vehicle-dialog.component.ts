import { Component, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith, take } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { AddVehicleSuccessDialogComponent } from '../../../../shared/presentation/add-vehicle-success-dialog/add-vehicle-success-dialog.component';

type AddVehicleDialogPhase = 'form' | 'success';

@Component({
  selector: 'app-add-vehicle-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, AddVehicleSuccessDialogComponent],
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrl: './add-vehicle-dialog.component.scss',
})
export class AddVehicleDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly policyRepository = inject(POLICY_REPOSITORY);

  /** When true, the dialog is visible. */
  readonly open = input(false);

  readonly closed = output<void>();
  /** Emits the new vehicle policy id after a successful save. */
  readonly vehicleAdded = output<string>();

  readonly phase = signal<AddVehicleDialogPhase>('form');
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

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.phase() === 'form' && !this.saving()) {
      this.dismiss();
    }
  }

  dismiss(): void {
    if (this.saving()) {
      return;
    }
    this.reset();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.canSave() || this.saving()) {
      return;
    }

    const { plateNo, ownerFullName } = this.form.getRawValue();
    const plate = plateNo.trim().toUpperCase();
    this.saving.set(true);

    this.policyRepository
      .addVehicle({ plate, ownerFullName: ownerFullName.trim() })
      .pipe(take(1))
      .subscribe({
        next: (vehicleId) => {
          this.phase.set('success');
          this.vehicleAdded.emit(vehicleId);
        },
        complete: () => {
          this.saving.set(false);
        },
        error: () => {
          this.saving.set(false);
        },
      });
  }

  onSuccessClose(): void {
    this.reset();
    this.closed.emit();
  }

  private reset(): void {
    this.phase.set('form');
    this.form.reset({ plateNo: '', ownerFullName: '' });
  }

  private hasRequiredValues(): boolean {
    const { plateNo, ownerFullName } = this.form.getRawValue();
    return plateNo.trim().length > 0 && ownerFullName.trim().length > 0;
  }
}

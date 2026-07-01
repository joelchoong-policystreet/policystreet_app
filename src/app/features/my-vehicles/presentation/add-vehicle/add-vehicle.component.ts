import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith, take } from 'rxjs/operators';

import { POLICY_REPOSITORY } from '../../../policies/domain/policy-repository.token';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';
import { PageChromeComponent } from '../../../../shared/presentation/page-chrome/page-chrome.component';
import { AddVehicleSuccessDialogComponent } from '../../../../shared/presentation/add-vehicle-success-dialog/add-vehicle-success-dialog.component';
import { QuickActionsComponent } from '../../../../shared/presentation/quick-actions/quick-actions.component';
import { ShellHeaderStore } from '../../../../shared/presentation/shell-header/shell-header.store';
import { WhatsappFabComponent } from '../../../../shared/presentation/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CachedAssetImgDirective,
    PageChromeComponent,
    AddVehicleSuccessDialogComponent,
    QuickActionsComponent,
    WhatsappFabComponent,
  ],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})
export class AddVehicleComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly inAppNav = inject(InAppNavigationHistoryService);
  private readonly policyRepository = inject(POLICY_REPOSITORY);
  private readonly shellHeader = inject(ShellHeaderStore);

  readonly saving = signal(false);
  readonly showSuccess = signal(false);

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

  ngOnInit(): void {
    this.shellHeader.set({
      title: 'My Vehicles',
      showBack: true,
      onBack: () => this.goBack(),
    });
  }

  ngOnDestroy(): void {
    this.shellHeader.clear();
  }

  goBack(): void {
    const returnTo = this.resolveReturnTo();
    if (returnTo) {
      void this.router.navigateByUrl(returnTo);
      return;
    }
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
          this.showSuccess.set(true);
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
    this.showSuccess.set(false);
    const returnTo = this.resolveReturnTo();
    if (returnTo) {
      void this.router.navigateByUrl(returnTo);
      return;
    }
    void this.router.navigate(['/my-vehicles']);
  }

  private resolveReturnTo(): string | null {
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (!returnTo?.startsWith('/') || returnTo.startsWith('//')) {
      return null;
    }
    return returnTo;
  }
}

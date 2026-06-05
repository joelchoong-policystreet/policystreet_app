import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

import {
  DEMO_PROFILE_EDIT_DETAILS,
  type ProfileEditTab,
} from '../../domain/profile-details.model';
import { CachedAssetImgDirective } from '../../../../shared/assets/cached-asset-img.directive';
import { InAppNavigationHistoryService } from '../../../../shared/navigation/in-app-navigation-history.service';

@Component({
  selector: 'app-profile-edit-details',
  standalone: true,
  imports: [ReactiveFormsModule, CachedAssetImgDirective],
  templateUrl: './profile-edit-details.component.html',
  styleUrl: './profile-edit-details.component.scss',
})
export class ProfileEditDetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly inAppNav = inject(InAppNavigationHistoryService);

  readonly activeTab = signal<ProfileEditTab>('personal');
  readonly saving = signal(false);

  readonly lockedPersonal = DEMO_PROFILE_EDIT_DETAILS.personal;

  private readonly initialEditable = {
    nationality: DEMO_PROFILE_EDIT_DETAILS.personal.nationality,
    gender: DEMO_PROFILE_EDIT_DETAILS.personal.gender,
    maritalStatus: DEMO_PROFILE_EDIT_DETAILS.personal.maritalStatus,
    email: DEMO_PROFILE_EDIT_DETAILS.personal.email,
    mobileNo: DEMO_PROFILE_EDIT_DETAILS.personal.mobileNo,
    addressLine1: DEMO_PROFILE_EDIT_DETAILS.address.addressLine1,
    addressLine2: DEMO_PROFILE_EDIT_DETAILS.address.addressLine2,
    city: DEMO_PROFILE_EDIT_DETAILS.address.city,
    postcode: DEMO_PROFILE_EDIT_DETAILS.address.postcode,
    state: DEMO_PROFILE_EDIT_DETAILS.address.state,
  };

  readonly form = this.fb.nonNullable.group({
    nationality: [this.initialEditable.nationality],
    gender: [this.initialEditable.gender],
    maritalStatus: [this.initialEditable.maritalStatus],
    email: [this.initialEditable.email, Validators.required],
    mobileNo: [this.initialEditable.mobileNo, Validators.required],
    addressLine1: [this.initialEditable.addressLine1],
    addressLine2: [this.initialEditable.addressLine2],
    city: [this.initialEditable.city],
    postcode: [this.initialEditable.postcode],
    state: [this.initialEditable.state],
  });

  readonly canSave = toSignal(
    this.form.valueChanges.pipe(
      map(() => this.hasSavableChanges()),
      startWith(this.hasSavableChanges()),
    ),
    { initialValue: false },
  );

  readonly isPersonalTab = computed(() => this.activeTab() === 'personal');
  readonly isAddressTab = computed(() => this.activeTab() === 'address');

  goBack(): void {
    this.inAppNav.backOrNavigate(['/profile']);
  }

  setTab(tab: ProfileEditTab): void {
    this.activeTab.set(tab);
  }

  onSave(): void {
    if (!this.canSave() || this.saving()) {
      return;
    }

    this.saving.set(true);
    void this.router.navigate(['/profile']).finally(() => {
      this.saving.set(false);
    });
  }

  private hasSavableChanges(): boolean {
    if (!this.form.valid) {
      return false;
    }

    const current = this.form.getRawValue();
    return (
      current.nationality.trim() !== this.initialEditable.nationality.trim() ||
      current.gender.trim() !== this.initialEditable.gender.trim() ||
      current.maritalStatus.trim() !== this.initialEditable.maritalStatus.trim() ||
      current.email.trim() !== this.initialEditable.email.trim() ||
      current.mobileNo.trim() !== this.initialEditable.mobileNo.trim() ||
      current.addressLine1.trim() !== this.initialEditable.addressLine1.trim() ||
      current.addressLine2.trim() !== this.initialEditable.addressLine2.trim() ||
      current.city.trim() !== this.initialEditable.city.trim() ||
      current.postcode.trim() !== this.initialEditable.postcode.trim() ||
      current.state.trim() !== this.initialEditable.state.trim()
    );
  }
}

import { Component, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type PolicyDetails = {
  id: string;
  status: 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED';
  policyNo: string;
  insurerProvider: string;
  typeOfCoverage: string;
  sumInsured: string;
  ncd: string;
  coveragePeriod: string;
  premiumPaidAmount: string;
  addOns: string[];
  carPlateNumber: string;
  carModel: string;
  ownerFullName: string;
  ownerIcNumber: string;
  mobileNumber: string;
  emailAddress: string;
  maritalStatus: string;
  gender: string;
  residentialAddress: string;
  paymentMethod: string;
  documents: string[];
};

const POLICY_DETAILS_MOCK: ReadonlyArray<PolicyDetails> = [
  {
    id: 'p1',
    status: 'ACTIVE',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'VEJ1234',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p2',
    status: 'EXPIRING SOON',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'QME1324',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p3',
    status: 'EXPIRED',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'ABC8888',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p4',
    status: 'ACTIVE',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'WQJ4721',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p5',
    status: 'EXPIRING SOON',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'JTB9016',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p6',
    status: 'ACTIVE',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'PKR3308',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p7',
    status: 'EXPIRED',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'MNS7642',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
  {
    id: 'p8',
    status: 'EXPIRING SOON',
    policyNo: 'Motor-Policy20250704-1536123412341',
    insurerProvider: 'Allianz Malaysia Berhad',
    typeOfCoverage: 'Comprehensive',
    sumInsured: 'RM 49,000.00',
    ncd: '55%',
    coveragePeriod: 'DD/MM/YYYY - DD/MM/YYYY',
    premiumPaidAmount: 'RM 1,110.97',
    addOns: [
      'Drive+ Membership (Standard)',
      'Road tax renewal',
      'Additional driver(s)',
      'Windscreen coverage',
      'Special Perils (flood or other convulsions of nature)',
    ],
    carPlateNumber: 'BHV2195',
    carModel: 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)',
    ownerFullName: 'Jermaine Imerio',
    ownerIcNumber: '970123-14-5678',
    mobileNumber: '+6011123456789',
    emailAddress: 'jermaine@example.com',
    maritalStatus: 'Single',
    gender: 'Male',
    residentialAddress:
      'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    paymentMethod: "E-Wallet (Touch' n Go)",
    documents: [
      'Cert Wording',
      'PDS',
      'Duty of Disclosure',
      'Privacy Notice',
      'Policy Wording',
      'Policy Benefits',
      'Payment Receipt',
    ],
  },
];

@Component({
  selector: 'app-policy-details',
  standalone: true,
  templateUrl: './policy-details.component.html',
  styleUrl: './policy-details.component.scss',
})
export class PolicyDetailsComponent {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  readonly policy = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return POLICY_DETAILS_MOCK.find((item) => item.id === id) ?? POLICY_DETAILS_MOCK[0];
  });

  readonly isRenewDisabled = computed(() => this.policy().status === 'ACTIVE');

  goBack(): void {
    void this.router.navigate(['/policies']);
  }

  goNotifications(): void {
    void this.router.navigate(['/notifications']);
  }

  onRenewNow(): void {
    if (this.isRenewDisabled()) {
      return;
    }
    // Placeholder action until renewal flow route is confirmed.
  }
}

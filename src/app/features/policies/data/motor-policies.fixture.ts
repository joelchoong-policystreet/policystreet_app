/**
 * Demo-only policy list. Delete when real API is wired; keep domain types + repository implementation.
 */
import type { MotorPolicy, PolicyStatus } from '../domain/policy.model';

const DEMO_ADD_ONS: string[] = [
  'Drive+ Membership (Standard)',
  'Road tax renewal',
  'Additional driver(s)',
  'Windscreen coverage',
  'Special Perils (flood or other convulsions of nature)',
];

const DEMO_DOCUMENTS: string[] = [
  'Cert Wording',
  'PDS',
  'Duty of Disclosure',
  'Privacy Notice',
  'Policy Wording',
  'Policy Benefits',
  'Payment Receipt',
];

const DEMO_OWNER = {
  insurerProvider: 'Allianz Malaysia Berhad',
  sumInsured: 'RM 49,000.00',
  ncd: '55%',
  coveragePeriodLong: 'DD/MM/YYYY - DD/MM/YYYY',
  premiumPaidAmount: 'RM 1,110.97',
  addOns: DEMO_ADD_ONS,
  ownerFullName: 'Jermaine Imerio',
  ownerIcNumber: '970123-14-5678',
  mobileNumber: '+6011123456789',
  emailAddress: 'jermaine@example.com',
  maritalStatus: 'Single',
  gender: 'Male',
  residentialAddress:
    'Unit D-3A-06, Menara Suezcap 1, 2, Jalan Kerinchi Kiri, Pantai Dalam, 59200 Kuala Lumpur, Federal Territory of Kuala Lumpur',
  paymentMethod: "E-Wallet (Touch' n Go)",
  documents: DEMO_DOCUMENTS,
} as const;

type PolicyRow = Pick<
  MotorPolicy,
  'id' | 'status' | 'plate' | 'carModel' | 'policyNo' | 'coverageType' | 'coveragePeriodShort'
>;

function motorPolicy(row: PolicyRow): MotorPolicy {
  return {
    ...DEMO_OWNER,
    ...row,
  };
}

function row(
  id: string,
  status: PolicyStatus,
  plate: string,
  carModel: string,
  policyNo: string,
  coverageType: string,
  coveragePeriodShort: string,
): PolicyRow {
  return {
    id,
    status,
    plate,
    carModel,
    policyNo,
    coverageType,
    coveragePeriodShort,
  };
}

/**
 * Canonical demo policies: same ids / vehicles as list, details, and quotation step 2.
 */
export const MOTOR_POLICIES_FIXTURE: ReadonlyArray<MotorPolicy> = [
  motorPolicy(
    row('p1', 'ACTIVE', 'VEJ1234', 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)', 'Motor-Policy20250704-1536123412341', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p2', 'EXPIRING SOON', 'QME1324', 'MAZDA CX-5 2022 GVC PLUS 2.5G HIGH 2488 6 SP AUTOMATIC CONVENTIONAL', 'Motor-Policy20250704-1536123412341', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p3', 'EXPIRED', 'ABC8888', 'HONDA CITY 2022 V SENSING 1498 1 SP AUTOMATIC CONSTANTLY VARIABLE (CVT)', 'Motor-Policy20250704-1536123412341', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p4', 'ACTIVE', 'WQJ4721', 'TOYOTA VIOS 2021 G 1496 7 SP CVT', 'Motor-Policy20250704-1536123412399', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p5', 'EXPIRING SOON', 'JTB9016', 'PERODUA MYVI 2020 AV 1496 4 SP AUTOMATIC', 'Motor-Policy20250704-1536123412477', 'Third Party, Fire & Theft', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p6', 'ACTIVE', 'PKR3308', 'HONDA HR-V 2023 RS e:HEV 1498 E-CVT', 'Motor-Policy20250704-1536123412554', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p7', 'EXPIRED', 'MNS7642', 'PROTON X50 2022 PREMIUM 1477 7DCT', 'Motor-Policy20250704-1536123412631', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
  motorPolicy(
    row('p8', 'EXPIRING SOON', 'BHV2195', 'MAZDA 3 2021 HIGH PLUS 1998 6 SP AUTOMATIC', 'Motor-Policy20250704-1536123412702', 'Comprehensive', 'DD/MM/YY - DD/MM/YY'),
  ),
];

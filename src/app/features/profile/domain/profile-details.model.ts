/** Profile edit form — demo data aligned with Figma 3120:2633. */

export type ProfileEditTab = 'personal' | 'address';

export interface ProfilePersonalDetails {
  fullName: string;
  nricPassportNo: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  email: string;
  mobileNo: string;
}

export interface ProfileAddressDetails {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
}

export interface ProfileEditDetails {
  personal: ProfilePersonalDetails;
  address: ProfileAddressDetails;
}

export const DEMO_PROFILE_EDIT_DETAILS: ProfileEditDetails = {
  personal: {
    fullName: 'Noor Amira Binti Khairuddin',
    nricPassportNo: '961014-05-1231',
    dateOfBirth: '14/10/1996',
    nationality: '',
    gender: '',
    maritalStatus: '',
    email: 'nooramirakh@example.com',
    mobileNo: '+6011123456789',
  },
  address: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    state: '',
  },
};

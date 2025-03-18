import { JobTitleEnum } from '@novu/shared';
import type { User, Organization, OrganizationMembership } from '@clerk/backend';

export const CLERK_USER_1 = {
  id: 'clerk_user_1',
  externalId: null,
  firstName: 'firstName',
  lastName: 'lastName',
  emailAddresses: [],
  username: 'username',
  fullName: null,
  imageUrl: 'https://example.com',
  hasImage: true,
  publicMetadata: {
    showOnBoarding: true,
    showOnBoardingTour: 2,
    servicesHashes: {},
    jobTitle: JobTitleEnum.ENGINEER,
  },
  privateMetadata: {},
  unsafeMetadata: {},
  banned: false,
  createdAt: 1,
  updatedAt: 1,
  primaryEmailAddressId: '1',
  primaryPhoneNumberId: '1',
  primaryWeb3WalletId: '1',
  lastSignInAt: 1,
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
  samlAccounts: [],
  lastActiveAt: 1,
  createOrganizationEnabled: true,
  primaryEmailAddress: {
    id: '1',
    emailAddress: 'emailAddress',
    verification: null,
    linkedTo: [],
  },
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
  passwordEnabled: true,
  totpEnabled: true,
  backupCodeEnabled: true,
  twoFactorEnabled: true,
  locked: false,
  createOrganizationsLimit: 10,
  deleteSelfEnabled: true,
} as unknown as User;

export const CLERK_USER_2 = {
  ...CLERK_USER_1,
  id: 'clerk_user_2',
  externalId: null,
  firstName: 'firstName2',
  lastName: 'lastName2',
  emailAddresses: [],
  username: 'username2',
  fullName: null,
  imageUrl: 'https://example2.com',
  publicMetadata: {
    showOnBoarding: false,
    showOnBoardingTour: 2,
    servicesHashes: {},
    jobTitle: JobTitleEnum.ENGINEERING_MANAGER,
  },
  primaryEmailAddress: {
    id: '2',
    emailAddress: 'emailAddress',
    verification: null,
    linkedTo: [],
  },
  primaryPhoneNumber: null,
  primaryWeb3Wallet: null,
} as unknown as User;

export const CLERK_ORGANIZATION_1 = {
  id: 'clerk_org_1',
  name: 'Organization 1',
  slug: 'organization-1',
  imageUrl: 'https://example.com/organization-1.png',
  hasImage: true,
  createdBy: 'user_1',
  createdAt: 1_000_000,
  updatedAt: 1_000_000,
  publicMetadata: {},
  privateMetadata: {},
  maxAllowedMemberships: 10,
  adminDeleteEnabled: true,
  membersCount: 10,
} as unknown as Organization;

export const CLERK_ORGANIZATION_2 = {
  id: 'clerk_org_2',
  name: 'Organization 2',
  slug: 'organization-2',
  imageUrl: 'https://example.com/organization-2.png',
  hasImage: true,
  createdBy: 'user_1',
  createdAt: 1_000_000,
  updatedAt: 1_000_000,
  publicMetadata: {},
  privateMetadata: {},
  maxAllowedMemberships: 10,
  adminDeleteEnabled: true,
  membersCount: 10,
} as unknown as Organization;

export const CLERK_ORGANIZATION_1_MEMBERSHIP_1 = {
  id: 'clerk_membership_1',
  role: 'admin',
  publicMetadata: {},
  privateMetadata: {},
  createdAt: 1_000_000,
  updatedAt: 1_000_000,
  organization: CLERK_ORGANIZATION_1,
  publicUserData: {
    identifier: 'clerk_user_1',
    firstName: 'firstName',
    lastName: 'lastName',
    imageUrl: 'https://example.com',
    hasImage: true,
    userId: 'clerk_user_1',
  },
} as unknown as OrganizationMembership;

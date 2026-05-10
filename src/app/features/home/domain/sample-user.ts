/**
 * Demo profile for home screen (matches Figma sample).
 */
export interface HomeUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

/**
 * Mock API payload shape for easy future swap with real backend response.
 */
interface MockUserApiResponse {
  readonly user_id: string;
  readonly full_name: string;
  readonly email: string;
}

const MOCK_USER_API_RESPONSE: MockUserApiResponse = {
  user_id: 'user_demo_01',
  full_name: 'Joel',
  email: 'jermaine.lee@example.com',
};

/**
 * Map backend payload -> UI model.
 * Keep this adapter when switching to a real API response.
 */
const mapApiUserToHomeUser = (apiUser: MockUserApiResponse): HomeUser => ({
  id: apiUser.user_id,
  name: apiUser.full_name,
  email: apiUser.email,
});

export const SAMPLE_USER: HomeUser = mapApiUserToHomeUser(MOCK_USER_API_RESPONSE);

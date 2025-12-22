export function getPrivacyPolicyUrl(): string | null {
  const defaultUrl = 'https://bzdybel.github.io/lavirant-cards/privacy.html';

  const envValue =
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    typeof process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL === 'string'
      ? process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL
      : '';

  const url = envValue.trim();
  return url.length > 0 ? url : defaultUrl;
}

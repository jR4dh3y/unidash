
export default function LoginPage() {
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
  return null;
}

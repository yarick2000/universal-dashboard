export function GoogleRecaptchaToken({ token, name }: { token: string | null, name: string }) {
  return (
    <>
      {token && <input type="hidden" name={name} value={token} />}
    </>
  );
}

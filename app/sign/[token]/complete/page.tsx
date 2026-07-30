import SignFormClient from "./SignFormClient";

export default async function CompletePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SignFormClient token={token} />;
}

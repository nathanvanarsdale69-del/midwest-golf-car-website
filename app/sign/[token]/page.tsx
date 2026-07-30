import ViewClient from "./ViewClient";

export default async function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ViewClient token={token} />;
}

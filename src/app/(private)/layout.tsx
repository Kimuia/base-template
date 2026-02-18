export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: 인증 체크 구현
  // const session = await auth();
  // if (!session) redirect('/login');

  return <>{children}</>;
}

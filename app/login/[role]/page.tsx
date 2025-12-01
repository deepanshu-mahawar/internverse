export default function Login({ params }: { params: { role: string } }) {
  const { role } = params;
  return <div>Login Page for {role}</div>;
}

import { SessionProvider } from "next-auth/react";
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchWhenOffline={false} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};

export default AuthProvider;

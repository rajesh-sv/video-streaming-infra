import { useContext, createContext, type ReactNode, useState } from "react";
import { type AuthContextType } from "@/types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = (): AuthContextType => {
  const value = useContext(AuthContext);
  if (value == null) {
    throw new Error("AuthContext required");
  }
  return value;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ userAuthenticated, setUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

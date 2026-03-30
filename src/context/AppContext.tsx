 import React, { type ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
// 

interface AppContextProps {
  children: ReactNode;
}
 
const AppContext = ({ children }: AppContextProps) => {
  return (
    <AuthProvider>
      {/* <ResumeProvider> wrap here if you create a resume context */}
      {children}
      {/* </ResumeProvider> */}
    </AuthProvider>
  );
};

export default AppContext;
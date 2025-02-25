"use client";

import React, { ReactNode, createContext, useContext } from "react";

import { Session } from "next-auth";

const SessionContext = createContext<Session>({} as Session);

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

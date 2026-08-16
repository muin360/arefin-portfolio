import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string | null;
      isAdmin?: boolean;
    };
  }

  interface User {
    id?: string;
    login?: string | null;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    login?: string | null;
    isAdmin?: boolean;
    email?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    login?: string | null;
    isAdmin?: boolean;
    email?: string | null;
  }
}



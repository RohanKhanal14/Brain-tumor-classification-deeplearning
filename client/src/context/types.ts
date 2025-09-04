export type User = {
  id: string;
  name: string;
  email: string;
  userType: string;
  avatar?: string;
  organization?: string;
  location?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

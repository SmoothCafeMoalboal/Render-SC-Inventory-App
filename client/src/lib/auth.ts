// Simple auth utilities for the restaurant inventory system

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  department?: string;
  isActive: boolean;
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  return user?.role === requiredRole || user?.role === "admin";
};

export const hasDepartmentAccess = (department: string): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin" || user?.role === "manager" || user?.department === department;
};

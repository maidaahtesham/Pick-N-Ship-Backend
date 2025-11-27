// hooks/useAuth.ts
export const useAuth = () => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const roleName = localStorage.getItem("roleName") || "";

  const hasPermission = (permission: string, minLevel: 'view_only' | 'add' | 'edit' | 'full_control' = 'view_only') => {
    const perm = permissions.find((p: any) => 
      p.permission.toLowerCase() === permission.toLowerCase()
    );
    if (!perm) return false;

    const levels = { view_only: 1, add: 2, edit: 3, full_control: 4 };
    return levels[perm.access_level] >= levels[minLevel];
  };

  const hasRole = (role: string) => roleName.toLowerCase() === role.toLowerCase();

  return { permissions, roleName, hasPermission, hasRole };
};
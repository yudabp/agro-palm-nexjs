"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  roleName: string | null;
  roleDescription: string | null;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);

      if (usersRes.ok && rolesRes.ok) {
        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        setUsers(usersData);
        setRoles(rolesData);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, roleId: number) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Role assigned: ${data.roleName}`);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to assign role");
      }
    } catch (error) {
      toast.error("Error assigning role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Users & Roles
          </CardTitle>
          <CardDescription>
            Assign roles to users. Direksi has read-only access, Superadmin has full access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.roleName ? (
                      <div>
                        <Badge variant="outline">{user.roleName}</Badge>
                        {user.roleDescription && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.roleDescription}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="destructive">No Role</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => assignRole(user.id, parseInt(value))}
                      disabled={updating === user.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            <div className="flex items-center gap-2">
                              {role.name}
                              {role.name === "Superadmin" && (
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Overview of what each role can do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => {
            const permissions = JSON.parse(role.permissions || "{}");
            return (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{role.name}</h3>
                  <Badge variant="outline">{role.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {permissions.read && (
                    <Badge variant="secondary">Read</Badge>
                  )}
                  {permissions.export && (
                    <Badge variant="secondary">Export</Badge>
                  )}
                  {permissions.write && (
                    <Badge variant="default">Write</Badge>
                  )}
                  {permissions.delete && (
                    <Badge variant="destructive">Delete</Badge>
                  )}
                  {permissions.manageUsers && (
                    <Badge variant="outline">Manage Users</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
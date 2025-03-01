"use client";

import { useCallback, useMemo, useState } from "react";

import { useUsersQuery } from "@/actions/queries/admin.queries";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { User } from "next-auth";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Skeleton from "./Skeleton";
import UserManipulations from "./UserManipulations";

interface UserContextMenuProps {
  userData: User;
  sessionUser: User;
}

const UserTable = ({ sessionUser }: { sessionUser: User }) => {
  const { data: users, error, isLoading } = useUsersQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!users) return <NoDataFallback />;

  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Docs</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || "/user.jpg"}
                      alt={user.name || user.email.split("@")[0]}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) ||
                        user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{user.name || user.email.split("@")[0]}</span>
                    <span className="text-muted-foreground">
                      {user.company?.name || "No company"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.role === "SUPERADMIN"
                      ? "destructive"
                      : user.role === "ADMIN"
                        ? "default"
                        : "secondary"
                  }
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.createdDocs} / {user.allowedDocs}
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <UserContextMenu userData={user} sessionUser={sessionUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const UserContextMenu = ({ userData, sessionUser }: UserContextMenuProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Memoize the user data to prevent unnecessary re-renders
  const userToEdit = useMemo(
    () => ({
      id: userData.id!,
      name: userData.name!,
      email: userData.email!,
      role: userData.role.toLowerCase() as "user" | "admin" | "superadmin",
      companyId: userData.company?.id,
    }),
    [userData],
  );

  // Use callback to prevent unnecessary re-renders
  const handleEditClick = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem>Placeholder 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditModalOpen && (
        <UserManipulations
          sessionUser={sessionUser}
          userToEdit={userToEdit}
          isOpenExternal={isEditModalOpen}
          onOpenChangeExternal={setEditModalOpen}
        />
      )}
    </>
  );
};

export default UserTable;

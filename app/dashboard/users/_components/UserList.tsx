"use client";

import { useCallback, useMemo, useState } from "react";

import { useUsersQuery } from "@/actions/queries/admin.queries";
import DeleteUser from "@/app/dashboard/users/_components/DeleteUser";
import Skeleton from "@/app/dashboard/users/_components/Skeleton";
import UserManipulations from "@/app/dashboard/users/_components/UserManipulations";
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
                {user.id !== sessionUser.id && (
                  <UserContextMenu userData={user} sessionUser={sessionUser} />
                )}
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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleDeleteClick = useCallback(() => {
    setDeleteModalOpen(true);
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
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
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

      {isDeleteModalOpen && (
        <DeleteUser
          userData={userData}
          sessionUser={sessionUser}
          isOpenExternal={isDeleteModalOpen}
          onOpenChangeExternal={setDeleteModalOpen}
        />
      )}
    </>
  );
};

export default UserTable;

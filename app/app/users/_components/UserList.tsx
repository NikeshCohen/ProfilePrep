"use client";

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

interface UserContextMenuProps {
  userId: string;
}

const UserTable = ({ sessionUser }: { sessionUser: User }) => {
  const { data: users, error, isLoading } = useUsersQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!users) return <NoDataFallback />;

  return (
    <div className="bg-background/30 border rounded-md">
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
                  <Avatar className="w-8 h-8">
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
                        ? "secondary"
                        : "default"
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
                <UserContextMenu userId={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const UserContextMenu = ({ userId }: UserContextMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 w-8 h-8">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("Placeholder 1", userId)}>
          Placeholder 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Placeholder 2", userId)}>
          Placeholder 2
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserTable;

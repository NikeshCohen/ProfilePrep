"use client";

import { useMemo } from "react";

import { useUsersQuery } from "@/actions/queries/admin.queries";
import { formatDistanceToNow } from "date-fns";
import { Mail, MoreHorizontal, User as UserIcon } from "lucide-react";
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

import { isSuperAdmin, isAdmin, canAccessCompanyResource, isCandidate, isUser } from "@/lib/roleUtils";

// Type for database user with all properties
type DatabaseUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  userType: "RECRUITER" | "CANDIDATE" | "TESTER";
  isTestAccount: boolean;
  createdDocs: number;
  allowedDocs: number;
  company?: {
    id: string;
    name: string;
  } | null;
};

interface MemberContextMenuProps {
  memberData: DatabaseUser;
  sessionUser: User;
}

const MemberContextMenu = ({
  memberData,
  sessionUser,
}: MemberContextMenuProps) => {
  const canModify =
    isSuperAdmin(sessionUser) ||
    (isAdmin(sessionUser) && !isSuperAdmin(memberData));

  if (!canModify) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          Contact Member
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MemberTable = ({ sessionUser }: { sessionUser: User }) => {
  const { data: members, error, isLoading } = useUsersQuery(sessionUser);

  const filteredMembers = useMemo(() => {
    if (!members) return [];

    return members.filter(
      (member: DatabaseUser) =>
        isCandidate(member) &&
        canAccessCompanyResource(sessionUser, member.company?.id),
    );
  }, [members, sessionUser]);

  if (isLoading) {
    return (
      <div className="rounded-md border bg-background/30">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <ErrorFallback error={error} />;
  if (!filteredMembers.length) return <NoDataFallback />;

  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Document Usage</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member: DatabaseUser) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={member.image || ""}
                      alt={member.name || ""}
                    />
                    <AvatarFallback>
                      {member.name?.charAt(0) || member.email?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={isUser(member) ? "secondary" : "default"}
                    className={
                      isAdmin(member) && !isSuperAdmin(member)
                        ? "bg-primary text-primary-foreground"
                        : isSuperAdmin(member)
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : ""
                    }
                  >
                    {member.role}
                  </Badge>
                  {member.isTestAccount && (
                    <Badge
                      variant="outline"
                      className="border-orange-600 text-orange-600"
                    >
                      Demo
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <span className="font-medium">{member.createdDocs || 0}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    / {member.allowedDocs || 5}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(
                    ((member.createdDocs || 0) / (member.allowedDocs || 5)) *
                      100,
                  )}
                  % used
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDistanceToNow(new Date(member.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <MemberContextMenu
                  memberData={member}
                  sessionUser={sessionUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface MemberListProps {
  sessionUser: User;
}

export default function MemberList({ sessionUser }: MemberListProps) {
  return <MemberTable sessionUser={sessionUser} />;
}

"use client";

import { useAdminDocsQuery } from "@/actions/queries/admin.queries";
import DocContextMenu from "@/app/dashboard/cvs/_components/ContextMenu";
import Skeleton from "@/app/dashboard/cvs/_components/Skeleton";
import { formatDistanceToNow } from "date-fns";
import { User } from "next-auth";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import TruncatedText from "@/components/global/TuncateText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GeneratedDocsListProps {
  sessionUser: User;
}

const GeneratedDocsList = ({ sessionUser }: GeneratedDocsListProps) => {
  const { data, error, isLoading } = useAdminDocsQuery(sessionUser);

  if (isLoading) return <Skeleton isAdmin={true} />;
  if (error) return <ErrorFallback error={error} />;
  if (!data?.success || !data.docInfo?.length) return <NoDataFallback />;

  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.docInfo!.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={doc.user?.image || "/user.jpg"}
                      alt={doc.user?.name || doc.user?.email.split("@")[0]}
                    />
                    <AvatarFallback>
                      {doc.user?.name?.charAt(0) ||
                        doc.user?.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {doc.user?.name || doc.user?.email.split("@")[0]}
                    </span>
                    <span className="text-muted-foreground">
                      {doc.company?.name || "No company"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.user?.email ?? ""} />
              </TableCell>
              <TableCell className="font-medium">
                <TruncatedText text={doc.candidateName} limit={40} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.location} />
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(doc.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <DocContextMenu docId={doc.id} notes={doc.notes} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GeneratedDocsList;

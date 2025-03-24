"use client";

import { useUserDocsQuery } from "@/actions/queries/user.queries";
import DocContextMenu from "@/app/dashboard/cvs/_components/ContextMenu";
import Skeleton from "@/app/dashboard/cvs/_components/Skeleton";
import { formatDistanceToNow } from "date-fns";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import TruncatedText from "@/components/global/TuncateText";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GeneratedDocsListProps {
  userId: string;
}

const GeneratedDocsList = ({ userId }: GeneratedDocsListProps) => {
  const { data, error, isLoading } = useUserDocsQuery(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!data?.success || !data.docInfo?.length) return <NoDataFallback />;

  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Right to Work</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.docInfo!.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <TruncatedText text={doc.candidateName} limit={40} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.location} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.salaryExpectation} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.rightToWork} />
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

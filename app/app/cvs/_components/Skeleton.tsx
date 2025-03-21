import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Skeleton({ isAdmin = false }: { isAdmin?: boolean }) {
  return isAdmin ? (
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
        <TableBody>{renderTableRows(isAdmin)}</TableBody>
      </Table>
    </div>
  ) : (
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
        <TableBody>{renderTableRows(isAdmin)}</TableBody>
      </Table>
    </div>
  );
}

const renderTableRows = (isAdmin: boolean) =>
  Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index}>
      {isAdmin ? (
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-500"></div>
            <div className="flex flex-col gap-2">
              <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
              <div className="h-2 w-24 animate-pulse rounded bg-neutral-500"></div>
            </div>
          </div>
        </TableCell>
      ) : (
        <TableCell>
          <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
        </TableCell>
      )}
      <TableCell>
        <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
      </TableCell>
      <TableCell>
        <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
      </TableCell>
      <TableCell>
        <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
      </TableCell>
      <TableCell>
        <div className="h-2 w-20 animate-pulse rounded bg-neutral-500"></div>
      </TableCell>
      <TableCell>
        <div className="h-2 w-8 animate-pulse rounded bg-neutral-500"></div>
      </TableCell>
    </TableRow>
  ));

export default Skeleton;

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Skeleton() {
  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Documents Per User</TableHead>
            <TableHead>Total Allowed Docs</TableHead>
            <TableHead>Total Generations</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-20 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-24 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-32 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-8 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-8 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Skeleton;

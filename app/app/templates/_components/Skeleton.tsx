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
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-2 w-10 animate-pulse rounded bg-neutral-500"></div>
              </TableCell>
              <TableCell>
                <div className="h-2 w-72 animate-pulse rounded bg-neutral-500"></div>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Skeleton;

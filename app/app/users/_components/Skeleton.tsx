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
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-500 rounded-full w-8 h-8 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-neutral-500 rounded w-32 h-2 animate-pulse"></div>
                    <div className="bg-neutral-500 rounded w-24 h-2 animate-pulse"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="bg-neutral-500 rounded w-32 h-2 animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="bg-neutral-500 rounded w-20 h-2 animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="bg-neutral-500 rounded w-24 h-2 animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="bg-neutral-500 rounded w-32 h-2 animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="bg-neutral-500 rounded w-8 h-2 animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Skeleton;

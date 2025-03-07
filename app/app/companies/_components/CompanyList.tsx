"use client";

import { useCallback, useMemo, useState } from "react";

import { useCompaniesQuery } from "@/actions/queries/admin.queries";
import { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { User } from "next-auth";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
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

import CompanyManipulations from "./CompanyManipulations";
import DeleteCompany from "./DeleteCompany";
import Skeleton from "./Skeleton";

type CompanyWithDetails = Prisma.CompanyGetPayload<{
  include: {
    _count: {
      select: {
        users: true;
        GeneratedDocs: true;
      };
    };
    users: {
      select: {
        allowedDocs: true;
      };
    };
  };
}>;

interface CompanyContextMenuProps {
  companyData: CompanyWithDetails;
  sessionUser: User;
}

const CompanyTable = ({ sessionUser }: { sessionUser: User }) => {
  const { data: companies, error, isLoading } = useCompaniesQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!companies) return <NoDataFallback />;

  return (
    <div className="bg-background/30 border rounded-md">
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
          {companies.map((company) => {
            const totalAllowedDocs = company.users.reduce(
              (sum, user) => sum + user.allowedDocs,
              0,
            );

            return (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span>{company.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{company._count.users}</TableCell>
                <TableCell>{company.allowedDocsPerUsers} docs</TableCell>
                <TableCell>{totalAllowedDocs} allowed</TableCell>
                <TableCell>
                  <Badge variant="default">
                    {company._count.GeneratedDocs}{" "}
                    {company._count.GeneratedDocs === 1
                      ? "generation"
                      : "generations"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {company.createdAt
                    ? formatDistanceToNow(new Date(company.createdAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <CompanyContextMenu
                    companyData={company}
                    sessionUser={sessionUser}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const CompanyContextMenu = ({
  companyData,
  sessionUser,
}: CompanyContextMenuProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Memoize the company data to prevent unnecessary re-renders
  const companyToEdit = useMemo(
    () => ({
      id: companyData.id,
      name: companyData.name,
      allowedDocsPerUsers: companyData.allowedDocsPerUsers,
    }),
    [companyData],
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
          <Button variant="ghost" className="p-0 w-8 h-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditModalOpen && (
        <CompanyManipulations
          sessionUser={sessionUser}
          companyToEdit={companyToEdit}
          isOpenExternal={isEditModalOpen}
          onOpenChangeExternal={setEditModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteCompany
          companyData={companyData}
          sessionUser={sessionUser}
          isOpenExternal={isDeleteModalOpen}
          onOpenChangeExternal={setDeleteModalOpen}
        />
      )}
    </>
  );
};

export default CompanyTable;

"use client";

import { useCallback, useMemo, useState } from "react";

import { useCompaniesQuery } from "@/actions/queries/admin.queries";
import CompanyManipulations from "@/app/dashboard/companies/_components/CompanyManipulations";
import DeleteCompany from "@/app/dashboard/companies/_components/DeleteCompany";
import Skeleton from "@/app/dashboard/companies/_components/Skeleton";
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

type CompanyWithDetails = Prisma.CompanyGetPayload<{
  include: {
    _count: {
      select: {
        users: true;
        GeneratedDocs: true;
        templates: true;
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
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Docs Per User</TableHead>
            <TableHead>Total Allowed Gens</TableHead>
            <TableHead>Total Generations</TableHead>
            <TableHead>Templates</TableHead>
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
                  <Badge variant="outline">
                    {company._count.templates}/{company.allowedTemplates}
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
      allowedTemplates: companyData.allowedTemplates,
      createdTemplates: companyData.createdTemplates,
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

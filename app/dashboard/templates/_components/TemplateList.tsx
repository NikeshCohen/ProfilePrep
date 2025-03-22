"use client";

import { useCallback, useState } from "react";

import { useTemplatesQuery } from "@/actions/queries/user.queries";
import DeleteTemplate from "@/app/dashboard/templates/_components/DeleteTemplate";
import EditTemplate from "@/app/dashboard/templates/_components/EditTemplate";
import Skeleton from "@/app/dashboard/templates/_components/Skeleton";
import ViewTemplate from "@/app/dashboard/templates/_components/ViewTemplate";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { User } from "next-auth";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
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

interface Template {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  templateContent: string;
  company: {
    id: string;
    name: string;
  };
}

interface TemplateContextMenuProps {
  template: Template;
  sessionUser: User;
}

const TemplateList = ({ sessionUser }: { sessionUser: User }) => {
  const { data, error, isLoading } = useTemplatesQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (data!.templates!.length === 0) return <NoDataFallback />;

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
          {data?.templates?.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-mono text-xs">
                {template.id.slice(-4)}
              </TableCell>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.company.name}</TableCell>
              <TableCell>
                {template.createdAt
                  ? formatDistanceToNow(new Date(template.createdAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <TemplateContextMenu
                  template={template}
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

const TemplateContextMenu = ({
  template,
  sessionUser,
}: TemplateContextMenuProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = useCallback(() => {
    setEditModalOpen(true);
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
          <ViewTemplate template={template} />
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          {sessionUser.role === "SUPERADMIN" && (
            <DeleteTemplate template={template} sessionUser={sessionUser} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditModalOpen && (
        <EditTemplate
          template={template}
          sessionUser={sessionUser}
          isOpenExternal={isEditModalOpen}
          onOpenChangeExternal={setEditModalOpen}
        />
      )}
    </>
  );
};

export default TemplateList;

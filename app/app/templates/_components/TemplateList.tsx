"use client";

import { useTemplatesQuery } from "@/actions/queries/admin.queries";
import { User } from "next-auth";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";

import Skeleton from "@/app/app/templates/_components/Skeleton";

const TemplateList = ({ sessionUser }: { sessionUser: User }) => {
  const { data, error, isLoading } = useTemplatesQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (data!.templates!.length === 0) return <NoDataFallback />;

  return <div></div>;
};

export default TemplateList;

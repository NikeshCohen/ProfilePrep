"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import ApplicationsList from "@/app/app/candidate/_components/ApplicationsList";
import MasterCVUpload from "@/app/app/candidate/_components/MasterCVUpload";
import TailorCV from "@/app/app/candidate/_components/TailorCV";
import { CandidateProfile } from "@prisma/client";
import { FileTextIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CandidateDashboard({ userId }: { userId: string }) {
  const [candidateProfile, setCandidateProfile] =
    useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidateProfile() {
      try {
        const response = await fetch(`/api/candidate/profile`);
        if (response.ok) {
          const data = await response.json();
          setCandidateProfile(data.profile);
        }
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidateProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="tailor">Tailor CV</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your master CV and professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!candidateProfile?.masterCVUploaded ? (
              <>
                <Alert className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>No Master CV Found</AlertTitle>
                  <AlertDescription>
                    Upload your comprehensive CV to start tailoring it for
                    specific jobs.
                  </AlertDescription>
                </Alert>
                <MasterCVUpload />
              </>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Master CV</h3>
                    <p className="text-muted-foreground">
                      Last updated:{" "}
                      {new Date(
                        candidateProfile.updatedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/app/candidate/master-cv">
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      View Master CV
                    </Link>
                  </Button>
                </div>
                <MasterCVUpload isUpdate />
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tailor" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tailor Your CV</CardTitle>
            <CardDescription>
              Customize your CV for specific job descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!candidateProfile?.masterCVUploaded ? (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Master CV Required</AlertTitle>
                <AlertDescription>
                  Please upload your master CV before tailoring for specific
                  jobs.
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href="/app/candidate?tab=profile">Go to Profile</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <TailorCV />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="applications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              Track the status of your job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationsList userId={userId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

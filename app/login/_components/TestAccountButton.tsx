"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2, TestTube } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestAccountButtonProps {
  redirectUrl: string;
}

const demoAccounts = [
  {
    email: "demo@profileprep.com",
    password: "Demo2024!",
    name: "Demo User (Recruiter)",
    description: "Basic recruiter account with CV generation access",
  },
  {
    email: "admin.demo@profileprep.com",
    password: "Admin2024!",
    name: "Demo Admin (Recruiter)",
    description: "Recruiter admin with user management and analytics",
  },
  {
    email: "candidate.demo@profileprep.com",
    password: "Candidate2024!",
    name: "Demo Candidate",
    description: "Basic candidate account with CV analysis features",
  },
  {
    email: "admin.candidate.demo@profileprep.com",
    password: "AdminCandidate2024!",
    name: "Demo Admin (Candidate)",
    description: "Candidate admin with organization management and analytics",
  },
  {
    email: "superadmin.demo@profileprep.com",
    password: "SuperAdmin2024!",
    name: "Demo SuperAdmin",
    description: "Full system access across all companies and organizations",
  },
];

export default function TestAccountButton({
  redirectUrl,
}: TestAccountButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const router = useRouter();

  const currentAccount = demoAccounts[selectedAccount];

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: currentAccount.email,
        password: currentAccount.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success(`Welcome, ${currentAccount.name}!`);
        // Get the appropriate dashboard route based on account type
        const targetRoute = currentAccount.email.includes("candidate")
          ? "/portal"
          : currentAccount.email.includes("admin") ||
              currentAccount.email.includes("superadmin")
            ? "/dashboard"
            : "/recruiter";

        router.push(redirectUrl || targetRoute);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (showCredentials) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TestTube className="h-4 w-4" />
            Demo Account Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Demo Account</Label>
            <Select
              value={selectedAccount.toString()}
              onValueChange={(value) => setSelectedAccount(parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose demo account" />
              </SelectTrigger>
              <SelectContent>
                {demoAccounts.map((account, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {currentAccount.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={currentAccount.email}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              value={currentAccount.password}
              disabled
              className="bg-muted font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${currentAccount.name}`
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCredentials(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo accounts with unlimited access and sample data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setShowCredentials(true)}
      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
    >
      <TestTube className="mr-2 h-4 w-4" />
      Try Demo Account
    </Button>
  );
}

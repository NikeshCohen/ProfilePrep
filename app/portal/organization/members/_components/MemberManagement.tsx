"use client";

import { useState } from "react";

import { UserPlus } from "lucide-react";
import { User } from "next-auth";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { isAdmin, isSuperAdmin } from "@/lib/roleUtils";

interface MemberManagementProps {
  sessionUser: User;
}

export default function MemberManagement({
  sessionUser,
}: MemberManagementProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    allowedDocs: "5",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically call an API to create the member
      // For now, we'll just show a success message
      toast.success("Member invitation sent successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "USER",
        allowedDocs: "5",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to invite member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAddMembers = isAdmin(sessionUser);

  if (!canAddMembers) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Organization Member</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to your candidate
            organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter member's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter member's email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  {isSuperAdmin(sessionUser) && (
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedDocs">Document Limit</Label>
              <Select
                value={formData.allowedDocs}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, allowedDocs: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 documents</SelectItem>
                  <SelectItem value="10">10 documents</SelectItem>
                  <SelectItem value="15">15 documents</SelectItem>
                  <SelectItem value="25">25 documents</SelectItem>
                  <SelectItem value="50">50 documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type CandidateData = {
  documentTitle: string;
  name: string;
  location: string;
  rightToWork: string;
  salaryExpectation: string;
  notes: string;
  templateId: string;
  templateContent?: string;
};

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

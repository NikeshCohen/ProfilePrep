import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-8">
      <div className="max-w-none">
        <h1 className="mb-8 text-center text-4xl font-extrabold">
          Terms of Service & Privacy Policy
        </h1>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">1. Terms of Service</h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                1.1 Acceptance of Terms
              </h3>
              <p className="text-muted-foreground">
                By using ProfilePrep, you agree to these Terms of Service. If
                you do not agree, please do not use the platform.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                1.2 Use of the Service
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>You must be at least 18 years old to use this service.</li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account.
                </li>
                <li>
                  Unauthorized use of the service may result in termination.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                1.3 Account & Access Control
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  We reserve the right to limit or revoke access to any user at
                  our discretion.
                </li>
                <li>
                  Users must comply with all applicable laws when using the
                  service.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                1.4 Changes to the Service
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  ProfilePrep may update or modify the platform at any time.
                </li>
                <li>
                  Continued use of the service after changes means you accept
                  the new terms.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                1.5 Limitation of Liability
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  We provide the service &quot;as is&quot; without warranties of
                  any kind.
                </li>
                <li>
                  We are not liable for any indirect, incidental, or
                  consequential damages.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-neutral-300 dark:bg-neutral-600" />

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">2. Privacy Policy</h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                2.1 Information We Collect
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  We collect basic user information, including email, name, and
                  authentication data.
                </li>
                <li>
                  If provided, we may store additional details related to user
                  preferences and interactions.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                2.2 How We Use Your Data
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>To provide and improve our services.</li>
                <li>
                  To ensure account security and prevent unauthorized access.
                </li>
                <li>To analyze usage trends for improving the platform.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                2.3 Data Sharing & Third Parties
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>We do not sell user data.</li>
                <li>
                  Data may be shared with third-party authentication providers
                  (e.g., Google) for login purposes.
                </li>
                <li>
                  If required by law, we may disclose user information to comply
                  with legal obligations.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">2.4 Data Retention</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  We store user data as long as necessary for service operation.
                </li>
                <li>
                  Users may request account deletion, which will remove all
                  associated data.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                2.5 Security Measures
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  We use industry-standard security practices to protect user
                  data.
                </li>
                <li>
                  However, no method of transmission over the internet is 100%
                  secure.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-neutral-300 dark:bg-neutral-600" />

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">3. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these terms or our privacy
            practices, contact us at{" "}
            <a
              href="mailto:support@profileprep.com"
              className="text-blue-600 hover:text-blue-800"
            >
              support@profileprep.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

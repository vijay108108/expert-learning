import { CheckCircle2, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCheckoutGuard } from "@/components/enroll/course-checkout-guard";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getCourseBySlug } from "@/lib/course-catalog";

const keyFeatures = [
  "Exam Voucher Included",
  "Live virtual classes led by industry experts",
  "Practice labs and projects with Azure labs",
  "Access to official Microsoft content aligned to the AZ-104 exam",
  "Simulation Test to get you exam ready",
  "24*7 support with dedicated mentoring sessions",
];

const skillsCovered = [
  "Administer Azure AD users and groups",
  "Oversee Azure subscriptions and governance",
  "Account configuration and Storage Management",
  "Automate resource provisioning using either Azure Resource Manager ARM templates or Bicep files",
  "Containers provisioning and management on Azure",
  "Configure and administer virtual networks within Azure",
  "Azure Resource Monitoring",
  "Azure resources access management",
  "Configure storage access Azure Storage firewalls and virtual networks",
  "Set up Azure Files and Azure Blob Storage",
  "Build and configure an Azure App Service",
  "Virtual Machines creation and Configuration",
  "Implement backup and recovery",
  "Configure name resolution and load balancing",
];

function MicrosoftAzureLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid grid-cols-2 gap-[2px] rounded-[8px] bg-white p-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
        <span className="h-5 w-5 rounded-[2px] bg-[#F25022]" />
        <span className="h-5 w-5 rounded-[2px] bg-[#7FBA00]" />
        <span className="h-5 w-5 rounded-[2px] bg-[#00A4EF]" />
        <span className="h-5 w-5 rounded-[2px] bg-[#FFB900]" />
      </div>
      <div className="leading-none">
        <p className="text-[15px] font-semibold text-[#737373] sm:text-[16px]">Microsoft</p>
        <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[#8C8C8C] sm:text-[24px]">Azure</p>
      </div>
    </div>
  );
}

export default function AzureAdministratorCoursePage() {
  const course = getCourseBySlug("azure-administrator");

  if (!course) {
    notFound();
  }

  return (
    <section className="bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_20%,#FFFFFF_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="rounded-[32px] border border-[#DBEAFE] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.08)] sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8D7EE] bg-[#EEF4FB] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#15407E]">
              <span className="h-2 w-2 rounded-full bg-[#15407E]" />
              Certification Aligned To
            </div>
            <div className="mt-6">
              <MicrosoftAzureLogo />
            </div>
            <h1 className="mt-7 max-w-4xl text-[28px] font-bold leading-[1.16] tracking-[-0.04em] text-[#0F172A] sm:text-[38px]">
              Microsoft Certified: Azure Administrator Associate AZ-104
            </h1>
            <p className="mt-4 text-[17px] font-medium text-[#15407E]">
              Learn to configure and manage cloud with AZ 104 Certification
            </p>
            <p className="mt-4 max-w-4xl text-[15px] leading-8 text-[#475569]">
              In this course, you will learn how to manage Azure subscriptions, secure identities, administer the
              infrastructure, configure virtual networking, connect Azure and on-premises sites, manage network
              traffic, implement storage solutions, create and scale virtual machines, implement web apps and
              containers, back up and share data, and monitor your solution.
            </p>
            <div className="mt-6 rounded-[24px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#0F172A]">AZ-104 Certification Course Overview</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#86EFAC] bg-[#F0FDF4] px-4 py-2 text-sm font-semibold text-[#16A34A]">
                  <ShieldCheck className="h-4 w-4" />
                  100% Money Back Guarantee
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-8 text-[#475569]">
                GenZNext&apos;s AZ-104 course gives you a deep understanding of the full administrative lifecycle in
                Azure environments. This certification-aligned track shows you how to maintain services related to
                computing, storage, networking, and security while preparing confidently for the AZ-104 Azure
                Administrator exam.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <CourseCheckoutGuard courseSlug={course.slug}>
              <EnrollmentForm
                course={{ slug: course.slug, title: course.title, priceValue: course.priceValue }}
                eyebrow="Enrollment Form"
                heading="Enter your details to continue"
                submitLabel="Proceed to Payment"
                compact
                className="rounded-[32px] border border-[#DBEAFE] bg-white p-5 shadow-[0_18px_50px_rgba(37,99,235,0.08)] sm:p-7"
              />
            </CourseCheckoutGuard>

            <div className="mt-4">
              <Link
                href={course.officialSyllabusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#C8D7EE] bg-[linear-gradient(135deg,#EEF4FB,#DBEAFE)] px-5 py-3.5 text-sm font-semibold text-[#1D4ED8] shadow-[0_10px_24px_rgba(59,130,246,0.10)] transition hover:border-[#60A5FA] hover:bg-[linear-gradient(135deg,#DBEAFE,#C8D7EE)]"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Syllabus
              </Link>
            </div>
          </aside>
        </div>

        <div className="rounded-[30px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#0F172A]">AZ-104 Training Key Features</h2>
          <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {keyFeatures.map((item) => (
              <div key={item} className="flex items-start gap-3 text-[16px] leading-8 text-[#334155]">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#3B82F6]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-[30px] font-bold tracking-[-0.04em] text-[#0F172A]">Skills Covered</h2>
          <div className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-2">
            {skillsCovered.map((skill) => (
              <div key={skill} className="flex items-start gap-3 text-[16px] leading-8 text-[#334155]">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#3B82F6]" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-[30px] font-bold tracking-[-0.04em] text-[#0F172A]">Benefits</h2>
          <p className="mt-5 text-[16px] leading-8 text-[#475569]">
            The Microsoft Certified Azure Administrator Associate (AZ-104) certification validates your skills in
            managing Microsoft Azure cloud environments. Certified Azure administrators have a wide range of job
            opportunities to choose from and advance their careers by moving into more senior and leadership roles.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-[#DBEAFE] bg-[#F8FBFF] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#64748B]">Designation</p>
              <div className="mt-6 rounded-2xl bg-white px-5 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                <p className="text-[24px] font-bold text-[#15407E]">Azure Administrator</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#DBEAFE] bg-[#F8FBFF] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#64748B]">Annual Salary</p>
              <div className="mt-6 rounded-2xl bg-white px-5 py-8 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                <div className="flex h-40 items-end justify-center gap-4">
                  {[
                    { label: "Min", value: "Rs. 439K", height: "h-6" },
                    { label: "", value: "", height: "h-16" },
                    { label: "Average", value: "Rs. 580K", height: "h-28" },
                    { label: "", value: "", height: "h-16" },
                    { label: "Max", value: "Rs. 1253K", height: "h-8" },
                  ].map((bar, index) => (
                    <div key={`${bar.label}-${index}`} className="flex flex-col items-center">
                      <span className="mb-2 text-xs font-semibold text-[#0F172A]">{bar.value}</span>
                      <div className={`w-10 rounded-t-[10px] bg-[linear-gradient(180deg,#93C5FD,#60A5FA)] ${bar.height}`} />
                      <span className="mt-2 text-xs font-medium text-[#475569]">{bar.label || " "}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-center text-sm text-[#64748B]">Source: Glassdoor</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

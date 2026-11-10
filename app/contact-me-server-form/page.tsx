import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Contact Me" };

export default function ContactMeServerFormPage() {
  return (
    <div className="max-w-xl">
      <PageHeader
        eyebrow="Contact me"
        title="Let's talk"
        description="Questions about a project, an opportunity, or just want to say hi? Send me a message and I'll get back to you."
      />
      <ContactForm />
    </div>
  );
}

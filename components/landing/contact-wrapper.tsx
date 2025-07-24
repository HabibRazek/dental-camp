import { Suspense } from "react";
import InnovativeContactSection from "./innovative-contact-section";
import { ContactSkeleton } from "@/components/skeletons/contact-skeleton";

export default function ContactWrapper() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <InnovativeContactSection />
    </Suspense>
  );
}

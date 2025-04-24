// app/sweepstakes/carlaborday/page.tsx
import RegisterSweepstake from "@/components/Register";
import { Suspense } from "react";

export default function SweepstakePage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <RegisterSweepstake />
    </Suspense>
  );
}

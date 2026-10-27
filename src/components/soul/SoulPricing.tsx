"use client";

import { useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { BillingToggle } from "./pricing/BillingToggle";
import { PricingFootnote } from "./pricing/PricingFootnote";
import {
  PricingPlanCard,
  type PricingPlanId,
} from "./pricing/PricingPlanCard";

const PLAN_IDS: PricingPlanId[] = ["basic", "pro", "max", "team"];

export function SoulPricing() {
  const [annual, setAnnual] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const toggle = () => setAnnual((value) => !value);

  return (
    <>
      <section className="bg-[#080909] pb-[100px] pt-[96px] text-white">
        <div className="px-6 text-center">
          <h2 className="font-grotesk text-[clamp(28px,4.5vw,49px)] font-bold uppercase leading-[.92] tracking-[-.045em]">
            Pick your plan
          </h2>
          <p className="mt-[19px] text-[15px] text-[#8b8d8f] md:text-[17px]">
            Get access to more generations and priority access to new features
          </p>
        </div>

        <div
          id="pricing-plans"
          className="mx-auto mt-[40px] flex w-[min(1405px,94vw)] flex-col gap-5 rounded-2xl border border-white/[.07] bg-[#0b0c0d] p-4 px-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] md:px-4"
        >
          <BillingToggle
            annual={annual}
            onMonthly={() => setAnnual(false)}
            onAnnual={() => setAnnual(true)}
            onToggle={toggle}
            accent="#ED1572"
          />

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            {PLAN_IDS.map((id) => (
              <PricingPlanCard
                key={id}
                id={id}
                annual={annual}
                onToggle={toggle}
                onGetPlan={() => setAuthMode("signup")}
              />
            ))}
          </div>

          <PricingFootnote />
        </div>
      </section>

      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </>
  );
}

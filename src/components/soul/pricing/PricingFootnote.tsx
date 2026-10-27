import Link from "next/link";

export function PricingFootnote() {
  return (
    <div className="mt-4 flex flex-col gap-1 text-center">
      <span className="text-center text-xs text-white/50">
        Unlimited models and Free Generations on plans are accessible only via
        higgsfield.ai and are not accessible on MCP/CLI, Canvas or Supercomputer.
        <br />
        Prices exclude VAT and local taxes, calculated at checkout. Unlimited
        usage may be subject to dynamic speed adjustments during high-traffic
        periods.{" "}
        <Link href="/pricing" className="cursor-pointer underline">
          Learn more
        </Link>
        <br />
        Access to new models and advanced features may be done on a rolling basis
        and not available to all users at launch.
      </span>
    </div>
  );
}

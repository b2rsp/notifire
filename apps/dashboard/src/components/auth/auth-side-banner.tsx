import { CircleCheck } from '../icons/circle-check';
import { Plug } from '../icons/plug';
import { ShieldZap } from '../icons/shield-zap';
import { Sparkling } from '../icons/sparkling';
import { AuthFeatureRow } from './auth-feature-row';
import { TrustedCompanies } from './trusted-companies';

export function AuthSideBanner() {
  return (
    <div className="inline-flex h-full w-full max-w-[476px] flex-col items-center justify-center gap-[50px] p-5">
      <div className="flex flex-col items-start justify-start gap-4">
        <div className="inline-flex items-center justify-start gap-3">
          <img src="/images/novu-logo-dark.svg" className="w-24" alt="logo" />
        </div>
        <div className="flex hidden flex-col items-start justify-start gap-4 md:block">
          <div className="flex flex-col items-start justify-start gap-1.5 self-stretch">
            <div className="text-2xl font-medium leading-8 text-neutral-950">
              Send your first notification in minutes.
            </div>
            <div className="inline-flex justify-start gap-1">
              <CircleCheck className="h-3 w-3" color="#99a0ad" />
              <div className="text-xs font-medium leading-none text-neutral-400">
                No credit card required, 10k events for free every month.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:flex-col md:items-start md:justify-start md:gap-8 md:self-stretch">
        <AuthFeatureRow
          icon={<Plug className="h-6 w-6 text-[#DD2450]" />}
          title="Powerful notifications, easy integrations"
          description="Unlimited workflows, unlimited providers, unlimited subscribers with 99.9% uptime SLA"
        />
        <AuthFeatureRow
          icon={<Sparkling className="h-6 w-6" />}
          title="As flexible as in-house built"
          description="Novu API-first approach, means that you can use just what you need, when you need it."
        />
        <AuthFeatureRow
          icon={<ShieldZap className="h-6 w-6" />}
          title="Observable and scalable with built-in security"
          description="Novu handles any volume, any channel, and any team for mission-critical notifications."
        />
      </div>
      <div className="hidden md:block">
        <TrustedCompanies />
      </div>
    </div>
  );
}

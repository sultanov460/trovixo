import { getValidDeliveryRange, getValidProcessingRange, getOriginLabel } from "@/lib/utils/shipping";
import type { ShippingEstimate } from "@/lib/types/product";
import { TruckIcon } from "@/components/ui/icons";

export function ShippingBlock({ shipping }: { shipping?: ShippingEstimate }) {
  const validated = getValidDeliveryRange(shipping);
  const processing = getValidProcessingRange(shipping);
  const originLabel = getOriginLabel(shipping?.origin);

  return (
    <div className="mt-6 rounded-[16px] border border-line bg-sand/35 p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
          <TruckIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">US delivery</p>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-ink-soft">
            {validated
              ? `Estimated delivery: ${validated.minDays}–${validated.maxDays} days`
              : "Delivery timing will be confirmed before orders open."}
          </p>
          {processing && (
            <p className="mt-0.5 text-xs leading-5 text-ink-soft/85">
              Processing: {processing.minDays}–{processing.maxDays} days
            </p>
          )}
          <p className="mt-1 text-xs leading-5 text-ink-soft/85">Ships to the United States · Tracking provided when available</p>
          {originLabel && <p className="mt-1 text-xs leading-5 text-ink-soft/85">{originLabel}</p>}
        </div>
      </div>
    </div>
  );
}

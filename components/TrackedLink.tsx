"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type EventName, type EventProps } from "@/lib/analytics";

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  trackOn: EventName;
  trackProps?: EventProps;
}

export default function TrackedLink({
  trackOn,
  trackProps,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(trackOn, trackProps);
        onClick?.(e);
      }}
    />
  );
}

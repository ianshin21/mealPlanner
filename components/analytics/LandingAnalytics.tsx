"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function LandingAnalytics() {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);
  return null;
}

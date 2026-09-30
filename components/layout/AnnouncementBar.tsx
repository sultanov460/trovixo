import { siteConfig } from "@/content/site-config";

export function AnnouncementBar() {
  return (
    <div className="bg-forest py-2 text-center text-xs font-medium tracking-wide text-paper">
      {siteConfig.announcement}
    </div>
  );
}

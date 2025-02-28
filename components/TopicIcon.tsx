import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { DocumentIcon } from "@sanity/icons";

interface TopicIconProps {
  icon: any;
  title: string;
  className?: string;
  size?: number;
}

export default function TopicIcon({ icon, title, className = "", size = 24 }: TopicIconProps) {
  
  // Check if an icon image exists
  if (icon?.asset?._ref) {
    return (
      <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
        <Image
          className="object-cover"
          width={size}
          height={size}
          alt={icon.alt || `Icon for ${title}`}
          src={urlForImage(icon)?.width(size).height(size).fit("crop").url() as string}
        />
      </div>
    );
  }

  // Fallback to default icon
  return (
    <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`} style={{ width: size, height: size }}>
      <DocumentIcon style={{ width: size * 0.6, height: size * 0.6 }} />
    </div>
  );
}
import Link from "next/link";

interface HoverCardProps {
  columnA: { heading: string; links: string[] };
  columnB: { heading: string; links: string[] };
  image: string;
}

export default function HoverCard({ columnA, columnB, image }: HoverCardProps) {
  return (
    <div className="w-[680px] rounded-xl bg-bg-surface border border-border-light shadow-xl p-7 flex gap-8">
      <div className="flex-1 flex gap-8">
        <div className="flex-1 flex flex-col gap-2.5">
          <h4 className="text-sm font-bold text-text-primary">{columnA.heading}</h4>
          {columnA.links.map((link) => (
            <Link key={link} href="/catalogue" className="text-[13px] text-text-secondary hover:text-border-gold transition-colors">
              {link}
            </Link>
          ))}
          <Link href="/catalogue" className="text-[13px] font-semibold text-text-gold mt-1">View All →</Link>
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          <h4 className="text-sm font-bold text-text-primary">{columnB.heading}</h4>
          {columnB.links.map((link) => (
            <Link key={link} href="/catalogue" className="text-[13px] text-text-secondary hover:text-border-gold transition-colors">
              {link}
            </Link>
          ))}
          <Link href="/catalogue" className="text-[13px] font-semibold text-text-gold mt-1">View All →</Link>
        </div>
      </div>
      <div className="w-[180px] rounded-lg overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="Category" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

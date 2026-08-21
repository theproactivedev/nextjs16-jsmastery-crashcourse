import { LucideIcon } from "lucide-react";

const SectionHeading = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) => {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2f4842]/10 text-[#2f4842]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-[#2f4842]">{title}</h3>
        {description && <p className="text-xs text-zinc-500">{description}</p>}
      </div>
    </div>
  );
}

export default SectionHeading;
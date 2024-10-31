"use client";

import { LuSearch } from "react-icons/lu";
import { Input } from "../ui/shadcn/input";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;

    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };
  return (
    <form
      method="GET"
      action={"/shop"}
      onSubmit={handleSubmit}
      className={cn("grow", className)}
    >
      <div className="relative">
        <Input name="q" className="ps-10" placeholder="Search" />
        <LuSearch className="size-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-3" />
      </div>
    </form>
  );
}

import Image from "next/image";
import logo from "@/../public/assets/logo.svg";
import { cn } from "~/lib/utils";

export default function CardWrapper({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[26rem] rounded-2xl", className)}>
      <div className="flex flex-col gap-y-6">
        <div className="gap-y-2 flex flex-col items-center justify-center w-full">
          <div className="relative size-12">
            <Image alt="Logo" src={logo} fill />
          </div>

          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

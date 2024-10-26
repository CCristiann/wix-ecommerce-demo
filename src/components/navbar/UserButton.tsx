"use client";

import { api } from "~/trpc/react";
import { Button, buttonVariants } from "../ui/shadcn/button";
import { toast } from "~/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import { LuLoader2, LuUser2 } from "react-icons/lu";
import { members } from "@wix/members";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  member?: members.Member | null;
}

export default function UserButton({ member }: UserButtonProps) {
  console.log("MEMBER", member)
  const router = useRouter()

  const { mutate: logout, isPending: isLoggingOut } =
    api.auth.logout.useMutation({
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: err.message,
        });
      },
      onSuccess: ({ logoutUrl }) => {
        if (logoutUrl) {
          router.push(logoutUrl)
          router.refresh()
        }
      },
    });

  if (member) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center bg-secondary/70 backdrop-blur-sm border border-input/50 rounded-md px-3 py-1.5 text-sm">
          <span>
            <LuUser2 className="size-4 mr-2" />
          </span>
          <span>{member.profile?.nickname || member.contact?.firstName}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex flex-col">
            My account
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <LuLoader2 className="animate-spin size-5" />
            ) : (
              <span>Logout</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href={"/login"}
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        Login
      </Link>
      <Link href={"/login"} className={buttonVariants({ size: "sm" })}>
        Register
      </Link>
    </div>
  );
}

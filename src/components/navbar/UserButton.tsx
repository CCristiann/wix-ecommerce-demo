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
import { LuLoader2, LuLogOut, LuUser2 } from "react-icons/lu";
import { members } from "@wix/members";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { WIX_SESSION_COOKIE } from "~/lib/costants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/shadcn/avatar";
import Image from "next/image";

interface UserButtonProps {
  member?: members.Member | null;
}

export default function UserButton({ member }: UserButtonProps) {
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
          Cookies.remove(WIX_SESSION_COOKIE);
          window.location.href = logoutUrl;
        }
      },
    });

  if (member) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar className="relative size-8 lg:size-10 overflow-hidden rounded-full">
            <AvatarFallback>
              <Image
                alt="User avatar"
                src={"/assets/user-placeholder.png"}
                fill
              />
            </AvatarFallback>
            <AvatarImage src={member.profile?.photo?.url} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-xs">
            {member.contact?.firstName || member.loginEmail}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem>
              <LuUser2 className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <LuLoader2 className="size-5 animate-spin" />
            ) : (
              <>
                <LuLogOut className="mr-2 size-4" />
                <span>Logout</span>
              </>
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
      <Link href={"/register"} className={buttonVariants({ size: "sm" })}>
        Register
      </Link>
    </div>
  );
}

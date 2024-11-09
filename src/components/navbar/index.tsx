import Image from "next/image";
import Container from "../common/Container";

import logo from "@/../public/assets/logo.svg";
import Cart from "./Cart";
import Link from "next/link";
import UserButton from "./UserButton";
import MainNavigation from "./MainNavigation";
import SearchField from "../common/SearchField";
import { api } from "~/trpc/server";
import { LuHeart } from "react-icons/lu";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/shadcn/button";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const member = await api.auth.getLoggedInMember();
  const collections = await api.collections.getCollections();

  return (
    <nav className="z-50 h-fit w-screen">
      <Container>
        <div className="flex w-full flex-col border-b border-input/50">
          <div className="flex items-center justify-between py-2">
            <MobileMenu collections={collections} loggedInMember={member ? member : null} />

            <div className="hidden lg:flex lg:w-1/4 items-center justify-start">
              <Link href="/" className="relative size-8">
                <Image alt={logo} src={logo} fill />
              </Link>
            </div>

            <div className="mx-4 hidden lg:flex lg:w-1/2 max-w-md justify-center">
              <SearchField className="w-full" />
            </div>

            <div className="flex lg:w-1/4 items-center justify-end space-x-2.5 lg:space-x-6">
              <div className="flex items-center justify-end space-x-2.5">
                <Cart />
                <Link
                  href={"/favorites"}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  <span className="relative flex flex-col items-center space-y-1">
                    <LuHeart className="size-6" />
                    <span className="hidden lg:block text-xs font-medium">Favorites</span>
                  </span>
                </Link>
              </div>

              <UserButton member={member} />
            </div>
          </div>

          <div className="pb-2 hidden lg:block">
            <MainNavigation collections={collections} />
          </div>
        </div>
      </Container>
    </nav>
  );
}

import Image from "next/image";
import Container from "../common/Container";

import logo from "@/../public/assets/logo.svg";
import Cart from "./Cart";
import Link from "next/link";
import UserButton from "./UserButton";
import MainNavigation from "./MainNavigation";
import SearchField from "../common/SearchField";
import { api } from "~/trpc/server";

export default async function Navbar() {
  const member = await api.auth.getLoggedInMember()
  const collections = await api.collections.getCollections()

  return (
    <nav className="w-screen h-fit sticky top-0 z-50 bg-background/90 backdrop-blur-md overflow-hidden md:overflow-visible">
      <Container>
        <div className="w-full border-b border-input/50 flex items-center justify-between py-3 gap-10 md:gap-16">
          <div className="flex gap-x-5 items-center">
            <Link href="/" className="relative size-8">
              <Image alt={logo} src={logo} fill />
            </Link>
            <MainNavigation collections={collections} />
          </div>

          <SearchField />

          <div className="flex gap-x-5 items-center">
            <Cart />
            <UserButton member={member} />
          </div>
        </div>
      </Container>
    </nav>
  );
}

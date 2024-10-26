import Container from "~/components/common/Container";
import { buttonVariants } from "~/components/ui/shadcn/button";
import Link from "next/link";

import { TiArrowRight } from "react-icons/ti";

export default function NotFound() {
  return (
    <section
      id="not-found"
      className="z-[999] fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm dark:bg-black/40"
    >
      <Container>
        <div className="flex flex-col gap-y-1.5 items-center justify-center w-full py-6">
          <h1 className="font-bold text-4xl">Not Found :&#40;</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Link href="/" className={buttonVariants()}>
            Go back to the home page
            <TiArrowRight className="size-4 ml-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

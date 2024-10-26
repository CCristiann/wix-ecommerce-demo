"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../ui/shadcn/dialog";
import { Drawer, DrawerContent } from "../ui/shadcn/drawer";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { useMediaQuery } from "~/hooks/use-media-query";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthModalProps {
  children: React.ReactNode;
  path: string;
}

export default function AuthModal({ children, path }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();

  const isDesktop = useMediaQuery(
    (state) => state.queries["(min-width: 768px)"],
  );
  const registerQuery = useMediaQuery((state) => state.registerQuery);
  const unregisterQuery = useMediaQuery((state) => state.unregisterQuery);

  useEffect(() => {
    // Registra la media query per la prima volta
    registerQuery("(min-width: 768px)");

    // Cleanup per rimuovere la media query quando il componente viene smontato
    return () => {
      unregisterQuery("(min-width: 768px)");
    };
  }, [registerQuery, unregisterQuery]);

  useEffect(() => {
    if (pathName !== path) {
      setIsOpen(false);
    }
  }, [pathName, path]);

  const handleClose = () => {
    setIsOpen(false);
    if (pathName === path) {
      router.back();
    } else {
      router.push("/"); // Reindirizza alla homepage o ad un'altra pagina.
    }
  };

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="flex max-w-[26rem] items-center justify-center">
          <VisuallyHidden.Root>
            <DialogTitle>Sign in</DialogTitle>
          </VisuallyHidden.Root>
          {children}
          <DialogClose
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleClose();
        }}
      >
        <DrawerContent className="h-[90vh]">
          <div className="flex flex-col items-center justify-center gap-y-8 px-5 py-10">
            <VisuallyHidden.Root>
              <DialogTitle>Sign in</DialogTitle>
            </VisuallyHidden.Root>

            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

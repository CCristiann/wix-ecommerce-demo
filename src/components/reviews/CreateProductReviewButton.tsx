"use client";

import { useEffect, useState } from "react";
import { products } from "@wix/stores";
import { Button, ButtonProps } from "../ui/shadcn/button";
import { members } from "@wix/members";
import { useMediaQuery } from "~/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/shadcn/dialog";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { useReviewModal } from "~/hooks/use-review-modal";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/shadcn/drawer";
import CreateProductReviewForm from "./CreateProductReviewForm";

interface CreateProductReviewButtonProps extends ButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
}

export default function CreateProductReviewButton({
  product,
  loggedInMember,
  ...props
}: CreateProductReviewButtonProps) {
  const { isOpen, openReviewModal, closeReviewModal } = useReviewModal();
  const onOpenChange = () => {
    if (isOpen) closeReviewModal();
    else openReviewModal();
  };

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

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button {...props} onClick={() => {}} disabled={!loggedInMember}>
            {loggedInMember ? "Write a review" : "Log in to create a review"}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-[26rem] items-center justify-center">
          <VisuallyHidden.Root>
            <DialogTitle>Sign in</DialogTitle>
          </VisuallyHidden.Root>

          <CreateProductReviewForm product={product} />

          <DialogClose
            onClick={() => closeReviewModal()}
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
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button {...props} onClick={() => {}} disabled={!loggedInMember}>
            {loggedInMember ? "Write a review" : "Log in to create a review"}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          <div className="flex flex-col items-center justify-center gap-y-8 px-5 py-10">
            <VisuallyHidden.Root>
              <DialogTitle>Sign in</DialogTitle>
            </VisuallyHidden.Root>

            <CreateProductReviewForm product={product} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}

"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    router.back();
  };
  console.log("Modal");
  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>hdd</DialogTitle>
          <DialogDescription>"d</DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[80dvh]">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

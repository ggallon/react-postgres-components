"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Question({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function onHashChange() {
    if (window.location.hash === `#${id}`) {
      track("Question open", { id });
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  return (
    <Collapsible
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      className="my-5"
    >
      <CollapsibleTrigger className="block w-full text-left font-bold">
        <a
          className="flex items-center hover:underline"
          id={id}
          href={`#${id}`}
        >
          <ChevronRight className="mr-1 inline-block" size={16} />
          {title}
        </a>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-5">{children}</CollapsibleContent>
    </Collapsible>
  );
}

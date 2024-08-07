"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function FormSubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props} disabled={props.disabled || pending}>
      <span className="flex items-center justify-center gap-2">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {props.children}
      </span>
    </Button>
  );
}

import * as React from "react";

import { cn } from "@/lib/utils";

interface UseCardProps extends React.ComponentProps<"div"> {
    border?: string;
}

function UseCard({ border, className, ...props}: UseCardProps) {
    return (
      <div
        data-slot="card"
        className={cn(
          "bg-card border dark:border-hidden text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm relative overflow-hidden ",
          className
        )}
        {...props}
      >
        {/* Pseudo-elemento para a borda gradiente */}
        <div
          className={cn("hidden absolute inset-0 rounded-xl dark:flex", border)} 
          style={{
            background:
              "linear-gradient(to bottom, #6051e6 6%, #5966e7 25%, #4f81e9 55%, #499bea 69%, #43a5eb 83%, #3bbeec 99%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", // Compatível com navegadores WebKit
            maskComposite: "exclude", // Compatível com outros navegadores
            padding: "1px", // Espessura da borda
            zIndex: 0, // Coloca o pseudo-elemento atrás do conteúdo
          }}
        />
        {/* Conteúdo do card */}
        <div className="relative z-10">
          {props.children}
        </div>
      </div>
    );
  }

export default UseCard;

function UseCardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            {...props}
        />
    )
}

function UseCardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("leading-none font-semibold", className)}
            {...props}
        />
    )
}

function UseCardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

function UseCardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    )
}

function UseCardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6", className)}
            {...props}
        />
    )
}

function UseCardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
            {...props}
        />
    )
}

export {
    UseCard, UseCardAction, UseCardContent, UseCardDescription, UseCardFooter, UseCardHeader, UseCardTitle
};


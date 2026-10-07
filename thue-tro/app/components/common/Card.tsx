import type { ReactNode } from "react";

type CardRadius = "S" | "MD" | "L" | "XL";

interface CardProps {
    radius?: CardRadius;
    children: ReactNode;
    className?: string;
}

const radiusClasses: Record<CardRadius, string> = {
    S: "rounded-sm",
    MD: "rounded-md",
    L: "rounded-lg",
    XL: "rounded-xl",
};

export default function Card({
    radius = "MD",
    children,
    className = "",
}: CardProps) {
    return (
        <div className={`
        w-full
        bg-white
        shadow-xs
        ${radiusClasses[radius]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

import { LoaderCircle } from "lucide-react";

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export default function Loading({
    text = "Đang tải dữ liệu...",
    fullScreen = true,
}: LoadingProps) {
    return (
        <div
            className={`
        flex flex-col items-center justify-center gap-4
        ${fullScreen ? "min-h-screen" : "w-full py-12"}
      `}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full bg-indigo-500/10 animate-ping" />

                <LoaderCircle
                    size={40}
                    strokeWidth={2.5}
                    className="relative animate-spin text-indigo-500"
                />
            </div>

            <div className="text-center space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {text}
                </p>

                <div className="flex items-center justify-center gap-1">
                    {[0, 1, 2].map((item) => (
                        <span
                            key={item}
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce"
                            style={{ animationDelay: `${item * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

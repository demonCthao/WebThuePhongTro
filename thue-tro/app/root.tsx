import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";

import { QueryProvider } from "./providers/query-provider";

import "./app.css";
import { useNotificationStore } from "./stores/notification.store";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const baseStyle: React.CSSProperties = {
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
};

const styles = {
  success: {
    ...baseStyle,
    "--normal-border": "#10b981",
    "--normal-text": "#10b981",
  } as React.CSSProperties,

  warning: {
    ...baseStyle,
    "--normal-border": "#f59e0b",
    "--normal-text": "#f59e0b",
  } as React.CSSProperties,

  error: {
    ...baseStyle,
    "--normal-border": "#ef4444",
    "--normal-text": "#ef4444",
  } as React.CSSProperties,
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        {children}

        <Toaster
          position="top-right"
          theme="dark"
          richColors={false}
          closeButton
          style={{
            zIndex: 2147483647,
          }}
        />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Theo dõi và hiển thị notification từ Zustand

function NotificationListener() {
  const notification = useNotificationStore();

  useEffect(() => {
    if (!notification.open || !notification.message) return;

    const baseStyle: React.CSSProperties = {
      background: "#1a1a1a",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: 500,
    };

    const styles: Record<string, React.CSSProperties> = {
      success: {
        ...baseStyle,
        borderColor: "#10b981",
        color: "#10b981",
      },
      warning: {
        ...baseStyle,
        borderColor: "#f59e0b",
        color: "#f59e0b",
      },
      error: {
        ...baseStyle,
        borderColor: "#ef4444",
        color: "#ef4444",
      },
    };

    const type = notification.type;

    if (type === "success" || type === "warning" || type === "error") {
      toast[type](notification.message, {
        style: styles[type],
        duration: 2500,
      });
    } else {
      return;
    }

    const timer = setTimeout(() => {
      notification.updateState({
        message: "",
        open: false,
        type: "",
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification.open, notification.message, notification.type]);

  return null;
}

export default function App() {
  return (
    <QueryProvider>
      <NotificationListener />
      <Outlet />
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>

      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

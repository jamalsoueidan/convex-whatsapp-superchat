import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { useState } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { Navigation } from "./components/Navigation";
import { RootWrapper } from "./components/RootWrapper";
import { SignIn } from "./components/Signin";

export async function loader() {
  const CONVEX_URL = process.env["CONVEX_URL"]!;
  return json({ ENV: { CONVEX_URL } });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();
  const [convex] = useState(() => new ConvexReactClient(ENV.CONVEX_URL));
  const theme = createTheme({});

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ConvexAuthProvider client={convex}>
            <RootWrapper>
              <Authenticated>
                <Navigation />
                {children}
                <BottomNavigation />
              </Authenticated>

              <Unauthenticated>
                <SignIn />
              </Unauthenticated>
            </RootWrapper>
          </ConvexAuthProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

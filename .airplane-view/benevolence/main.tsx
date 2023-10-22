import {
  Container,
  ViewProvider,
  setEnvVars,
  ErrorBoundary,
  useRouter,
} from "@airplane/views";
import React from "react";
import App from "../../weggies.airplane.view";
import hash from "object-hash";
import { render } from "__airplane_root/render";

const isInStudio = Boolean(true);

// Polyfill process.env.
const global =
  (typeof globalThis !== "undefined" && globalThis) ||
  (typeof self !== "undefined" && self) ||
  (typeof global !== "undefined" && global) ||
  {};
global.process = global.process || {};
global.process.env = global.process.env || {};

/**
 * Gets the value of a query parameter by key.
 * If the view is loaded in an iframe, this will get the query param from the iframe.
 */
const getQueryParam = (key: string) => {
  if (typeof window === "undefined") {
    return "";
  }
  return new URL(window.location.href).searchParams.get(key) || "";
};

/**
 * ENV_VAR_BLOCK_LIST is the list of query params we do not want to set as environment variables.
 * since the user doesn't need to access them.
 */
const RUNTIME_ENV_VAR_BLOCK_LIST = [
  "AIRPLANE_SANDBOX_TOKEN",
  "AIRPLANE_VIEW_TOKEN",
];

/**
 * Gets the value of all query params.
 * If the view is loaded in an iframe, this will get the query param from the iframe.
 */
const getAllQueryParams = () => {
  if (typeof window === "undefined") {
    return new URLSearchParams().entries();
  }
  return new URL(window.location.href).searchParams.entries();
};

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).toUpperCase();

const apiHost = import.meta.env.AIRPLANE_API_HOST || "https://api.airplane.dev"
// Plumb environment variables that are passed into the view -> @airplane/views.
setEnvVars(
  apiHost,
  import.meta.env.AIRPLANE_TOKEN,
  import.meta.env.AIRPLANE_API_KEY,
  getQueryParam("__env") || import.meta.env.AIRPLANE_ENV_SLUG,
  {
    AIRPLANE_TUNNEL_TOKEN: import.meta.env.AIRPLANE_TUNNEL_TOKEN,
    AIRPLANE_SANDBOX_TOKEN: getQueryParam("__airplane_sandbox_token"),
    AIRPLANE_VIEW_TOKEN: getQueryParam("__viewToken"),
    AIRPLANE_USE_SELF_HOSTED_INPUTS: getQueryParam("__airplane_use_self_hosted_inputs"),
  }
);

// Set runtime environment variables.
for (const [key, value] of getAllQueryParams()) {
  let title = key;
  let val = value;
  if (key.startsWith("__")) {
    const camel = key.slice(2);
    title = camelToSnakeCase(camel);
    if (isInStudio) {
      if (
        camel === "envSlug" ||
        camel === "envId" ||
        camel === "envName" ||
        camel === "env"
      ) {
        val = "studio";
      }
      if (camel === "envIsDefault") {
        val = "true";
      }
    }

    if (!title.startsWith("AIRPLANE_")) {
      title = `AIRPLANE_${title}`;
    }
  }

  if (!RUNTIME_ENV_VAR_BLOCK_LIST.includes(title)) {
    process.env[title] = val;
  }
}
process.env["AIRPLANE_API_HOST"] = apiHost;

if (typeof window !== undefined) {
  // Intercept window error and unhandledrejection events and send them to the parent window.
  window.addEventListener("error", (event) => {
    sendViewMessage({
      type: "console",
      messageType: "error",
      message: "Uncaught Error: " + event.error.message,
      stack: event.error.stack,
      hash: hash(event.error),
      time: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    sendViewMessage({
      type: "console",
      messageType: "error",
      message: "Unhandled Promise rejection: " + event.reason,
      hash: hash(event.reason ?? "undefined"),
      time: Date.now(),
    });
  });

  // Intercept keyboard events and send them to the parent window.
  window.addEventListener("keydown", (e) => {
    sendViewMessage({
      type: "key",
      messageType: "keydown",
      event: {
        key: e.key,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      },
    });
  });

  window.addEventListener("keyup", (e) => {
    sendViewMessage({
      type: "key",
      messageType: "keyup",
      event: {
        key: e.key,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      },
    });
  });
}

export const sendViewMessage = (message: ViewMessage) => {
  if (typeof window === undefined) {
    return;
  }
  window.parent.postMessage(message, "*");
};

// Keep in sync with ErrorConsoleMessage from web/lib/views/ViewMessage.ts
type ConsoleMessageBase = {
  type: "console";
  hash: string;
  // unix timestamp in milliseconds
  time: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalParams?: any[];
};

type ErrorConsoleMessage = {
  messageType: "error";
  id?: string;
  component?: string;
  stack?: string;
} & ConsoleMessageBase;

type KeyMessage = {
  type: "key";
  messageType: "keydown" | "keyup";
  event: Pick<
    KeyboardEvent,
    "key" | "ctrlKey" | "altKey" | "shiftKey" | "metaKey"
  >;
};

type ViewMessage = ErrorConsoleMessage | KeyMessage;

const AppWrapper = () => {
  const { params } = useRouter();
  return <App params={params} />;
};

render(
  <React.StrictMode>
    <ViewProvider>
      <ErrorBoundary>
        <Container p="xl">
          <AppWrapper />
        </Container>
      </ErrorBoundary>
    </ViewProvider>
  </React.StrictMode>
);

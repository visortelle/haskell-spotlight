import { render } from "../content/render";

export const shadowDomRootId = "haskell-extension-root";

function entrypoint(): void {
  const renderTarget = document.createElement("div");
  renderTarget.id = shadowDomRootId;
  document.body.appendChild(renderTarget);

  renderTarget.attachShadow({ mode: "open" });
  render({ to: renderTarget });
}

document.addEventListener("DOMContentLoaded", entrypoint);

export {};

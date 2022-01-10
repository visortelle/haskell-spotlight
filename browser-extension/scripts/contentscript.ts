import { render } from "../content/render";

function entrypoint(): void {
  const renderTarget = document.createElement("div");
  renderTarget.id = "haskell-extension-root";
  document.body.appendChild(renderTarget);

  render({ to: renderTarget });
  console.log("contentscript entrypoint");
}

document.addEventListener("DOMContentLoaded", entrypoint);

export {};

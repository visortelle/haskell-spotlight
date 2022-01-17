import * as vscode from "vscode";

let logger = vscode.window.createOutputChannel("Haskell Spotlight");

export function activate(context: vscode.ExtensionContext) {
  logger.appendLine("Activate");

  let panel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("haskellSpotlight.show", () => {
      const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          "haskellSpotlight",
          "Haskell Spotlight",
          column,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.joinPath(context.extensionUri, "build")
            ],
          }
        );

        panel.webview.html = getWebviewContent(context);
        return;
      }

      panel.reveal(column);
    })
  );
}

function getWebviewContent(
  context: vscode.ExtensionContext
) {
  const scriptPath = vscode.Uri.joinPath(
    context.extensionUri,
    "build",
    "webview.js"
  );
  const scriptUri = scriptPath.with({ scheme: "vscode-resource" });
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Haskell Spotlight</title>
</head>
<body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce() {
  logger.appendLine("Get once");

  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

import * as vscode from "vscode";

let logger = vscode.window.createOutputChannel("Haskell Spotlight");

export function activate(context: vscode.ExtensionContext) {
  logger.appendLine("Activate");

  context.subscriptions.push(
    vscode.commands.registerCommand("haskellSpotlight.show", () => {
      const panel = createPanel(context);
      panel.reveal(getColumn());
    })
  );
}

function createPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  let panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "haskellSpotlight",
    "Haskell Spotlight",
    getColumn(),
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "build")],
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewContent(context);

  return panel;
}

function getColumn(): vscode.ViewColumn {
  return vscode.ViewColumn.Two;
  // return vscode.window.activeTextEditor
  // ? vscode.window.activeTextEditor.viewColumn
  // : undefined;
}

function getWebviewContent(context: vscode.ExtensionContext) {
  const scriptPath = vscode.Uri.joinPath(
    context.extensionUri,
    "build",
    "webview.js"
  );
  const scriptUri = scriptPath.with({ scheme: "vscode-resource" });
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en" style="font-size: calc(var(--vscode-editor-font-size) / 16) !important;">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Haskell Spotlight</title>
</head>
<body style="background-color: var(--vscode-editorPane-background) !important;">
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

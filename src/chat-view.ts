import { ItemView, WorkspaceLeaf } from "obsidian";
import { ipcRenderer } from "electron";

export const CHAT_VIEW_TYPE = "chat-view";

export class ChatView extends ItemView {
	private webView: Electron.WebviewTag;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return CHAT_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "ChatGPT";
	}

	getIcon(): string {
		return "ChatGPTObsidian";
	}

	onOpen = async (): Promise<void> => {
		console.log("Opening ChatGPT view.");

		const gptUrl = "https://chat.openai.com";

		// Grab a reference to the container
		const view = this.containerEl.children[1];
		view.id = "chat-view";
		view.empty();

		// Create a webview with correct source
		this.webView = document.createElement("webview");
		this.webView.id = "chat-frame";
		this.webView.src = gptUrl;
		this.webView.setAttribute("partition", "Chat");
		// Prevent navigation and disable creation of new windows.
		this.webView.webpreferences += "contextIsolation";

		// Allows the webview to persist cookies and other data separately from other webviews in the app.
		ipcRenderer.send("session", "Chat");

		view.appendChild(this.webView);
	};

	onClose = async (): Promise<void> => {
		console.log("Closing ChatGPT view");
	};
}

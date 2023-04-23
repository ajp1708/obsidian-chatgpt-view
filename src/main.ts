import { Plugin, addIcon } from "obsidian";
import { ChatView, CHAT_VIEW_TYPE } from "./chat-view";

export default class ChatGPTViewPlugin extends Plugin {
	/**
	 * Function to load the custom icon for this plugin
	 */
	loadCustomIcon(): void {
		addIcon(
			"ChatGPTObsidian",
			`<svg xmlns="http://www.w3.org/2000/svg" width="80.000000pt" height="80.000000pt" viewBox="8 9 46.000000 64.000000">
		<g transform="translate(0.000000,68.000000) scale(0.100000,-0.100000)" fill="#9E9E9E" stroke="#9E9E9E" stroke-width="15">
		<path d="M191 567 l-104 -52 -43 -84 c-24 -46 -44 -92 -44 -102 0 -23 127 -281 143 -291 26 -16 118 -38 161 -38 68 0 72 10 121 326 8 50 17 98 21 107 3 10 -10 36 -36 69 -23 29 -53 68 -67 86 -14 17 -30 32 -37 32 -6 -1 -58 -24 -115 -53z m109 -7 c0 -25 -11 -37 -86 -90 -47 -34 -87 -60 -89 -58 -2 2 -6 23 -10 48 l-7 45 84 41 c46 23 89 42 96 43 7 0 12 -11 12 -29z m81 -53 c9 -16 6 -16 -31 3 -29 15 -40 26 -36 36 3 9 6 21 6 27 1 12 43 -34 61 -66z m-11 -31 c30 -18 54 -38 53 -44 -2 -6 -7 -44 -13 -84 -6 -40 -15 -93 -20 -118 -5 -25 -14 -74 -21 -110 -13 -70 -25 -100 -38 -100 -5 0 -29 40 -54 88 -25 48 -65 124 -89 168 -59 107 -60 108 -35 127 12 8 49 36 82 61 33 24 65 45 70 45 6 0 35 -15 65 -33z m-266 -78 c3 -40 9 -120 14 -178 5 -58 7 -107 6 -109 -2 -2 -28 47 -58 108 l-55 111 37 70 c20 38 40 70 44 70 3 0 9 -33 12 -72z m100 -191 c37 -70 75 -140 84 -156 9 -17 14 -32 11 -35 -3 -3 -30 3 -60 14 -29 11 -61 20 -71 20 -13 0 -17 13 -22 73 -11 143 -15 219 -12 216 2 -2 33 -61 70 -132z"/>
		<path d="M270 441 c-28 -5 -39 -14 -57 -46 -29 -55 -28 -74 10 -118 32 -38 32 -38 82 -30 45 8 52 13 72 48 29 54 28 65 -7 113 -31 43 -36 44 -100 33z m75 -21 c3 -6 -5 -10 -19 -10 -14 0 -31 -9 -40 -22 -9 -12 -19 -19 -22 -15 -4 4 3 18 16 32 24 26 54 33 65 15z m-88 -17 c-23 -26 -23 -28 -8 -47 10 -12 17 -14 27 -5 16 13 48 4 39 -10 -10 -17 -65 -9 -75 10 -14 25 -12 56 3 62 25 10 30 7 14 -10z m107 -19 c9 -4 16 -17 16 -33 l-1 -26 -14 25 c-7 14 -26 28 -42 31 l-28 7 27 1 c14 0 33 -2 42 -5z m-96 -75 c18 -1 21 -3 9 -6 -10 -3 -29 -2 -43 1 -18 5 -24 13 -24 34 l1 27 15 -27 c10 -19 23 -28 42 -29z m90 -9 c-2 -15 -10 -26 -23 -29 -17 -3 -18 -1 -6 12 8 10 10 28 6 49 -6 32 -5 32 10 13 9 -11 15 -31 13 -45z m-28 13 c-1 -5 -9 -18 -19 -30 -20 -24 -55 -31 -66 -13 -4 6 5 10 19 10 15 0 31 8 38 20 13 20 28 27 28 13z"/>
		</g>
		</svg>`
		);
	}

	/**
	 * Taken from https://marcus.se.net/obsidian-plugin-docs/guides/custom-views
	 * Activates the view and sets it (by default) in the sidebar on the right.
	 */
	activateView(): void {
		this.app.workspace.onLayoutReady(async () => {
			// Detach possible dangling leaves
			this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);

			// Add a new leaf
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: CHAT_VIEW_TYPE,
				active: true,
			});

			// Reveal the leaf
			this.app.workspace.revealLeaf(
				this.app.workspace.getLeavesOfType(CHAT_VIEW_TYPE)[0]
			);
		});
	}

	/**
	 * Determines whether to show or hide the view
	 */
	toggleView(): void {
		if (this.app.workspace.getLeavesOfType(CHAT_VIEW_TYPE).length < 1) {
			this.activateView();
		} else {
			this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
		}
	}

	async onload() {
		console.log("ChatGPT view plugin loaded.");

		// Adding custom icon
		this.loadCustomIcon();

		// Register the view
		this.registerView(CHAT_VIEW_TYPE, (leaf) => new ChatView(leaf));

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(
			"ChatGPTObsidian",
			"ChatGPT View",
			(evt: MouseEvent) => {
				this.toggleView();
			}
		);
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
	}
}

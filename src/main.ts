import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { ChatView, CHAT_VIEW_TYPE } from "./chat-view";

//TODO, add a way to use api token to login in directly through
//the URL.

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class ChatGPTViewPlugins extends Plugin {
	settings: MyPluginSettings;

	// This needs to persist
	viewShown = false;

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

		this.viewShown = true;
	}

	deactivateView(): void {
		this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE)
		this.viewShown = false;
	}

	async onload() {
		console.log("ChatGPT view plugin loaded.");

		await this.loadSettings();

		// Register the view
		this.registerView(CHAT_VIEW_TYPE, (leaf) => new ChatView(leaf));

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"ChatGPT View",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				if(!this.viewShown) {
					this.activateView();
				} else {
					this.deactivateView();
				}
			}
		);
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		//this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						console.log("Secret: " + value);
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }

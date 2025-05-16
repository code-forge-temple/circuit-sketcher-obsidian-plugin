/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {App, PluginManifest, TFile, addIcon} from "obsidian";
import {CIRCUIT_VIEW_TYPE, CircuitSketcherView} from "./CircuitSketcherView";
import {CircuitSketcherSettingTab} from './CircuitSketcherSettingTab';
import icon from './assets/icon.svg';
import {createIntermediaryFolders, dataUrlToUint8Array, hashPath} from "./utils/utils";
import {CREATE_FILE_COMMAND, FILE_EXTENSION, NEW_LIBRARY_CONTENT} from "./constants/constants";
import UpgradablePlugin from "./UpgradablePlugin";


export default class CircuitSketcherPlugin extends UpgradablePlugin {
    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.createNewCircuitSketcher = this.createNewCircuitSketcher.bind(this);
    }

    async onload () {
        await super.onload();

        this.addSettingTab(new CircuitSketcherSettingTab(this.app, this));

        addIcon('circuit', icon);

        // Register the custom view for `.circuit-sketcher` files
        this.registerView(CIRCUIT_VIEW_TYPE, (leaf) => new CircuitSketcherView(leaf, this));

        // Register `.circuit-sketcher` files to be visible in the file explorer
        this.registerExtensions([FILE_EXTENSION], CIRCUIT_VIEW_TYPE);

        // Add a command to create a new `.circuit-sketcher` file
        this.addCommand({
            id: "circuit-sketcher-create-new",
            name: "Create new file",
            callback: this.createNewCircuitSketcher,
        });

        // Add a button to create a new `.circuit-sketcher` file
        this.addRibbonIcon('circuit', CREATE_FILE_COMMAND, () => this.createNewCircuitSketcher());

        // Add a context menu item to create a new `.circuit-sketcher` file in Obsidian file explorer
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu, file) => {
                menu.addItem((item) => {
                    const targetPath = file instanceof TFile
                        ? this.app.vault.getAbstractFileByPath(file.parent?.path || "")?.path
                        : file.path;

                    item
                        .setTitle(CREATE_FILE_COMMAND)
                        .setIcon("circuit")
                        .onClick(() => this.createNewCircuitSketcher(targetPath));
                });
            })
        );

        // substitute the internal embeded `.circuit-sketcher` file with an image of it
        this.registerMarkdownPostProcessor(async (el, ctx) => {
            const embeds = el.querySelectorAll(`span.internal-embed[src$=".${FILE_EXTENSION}"]`);

            for (const embed of embeds) {
                let fileName = embed.getAttribute('src');

                if (!fileName) continue;

                const file = this.app.metadataCache.getFirstLinkpathDest(fileName, ctx.sourcePath);

                if (!file) continue;

                fileName = file.path;

                const pngPath = `${this.settings.cachePath}/${hashPath(fileName)}`;
                const img = document.createElement('img');

                img.src = this.app.vault.adapter.getResourcePath(pngPath);
                img.onerror = () => {
                    img.style.display = "none";
                };

                embed.parentElement?.replaceChild(img, embed);
            }
        });
    }

    async onunload () { }

    public fileName: string = "";

    private async createNewCircuitSketcher (path: string = "") {
        const newFileName = await this.generateUniqueFileName("Untitled", FILE_EXTENSION, path);
        const file = await this.app.vault.create(path ? `${path}/${newFileName}`: newFileName, "");
        const leaf = this.app.workspace.getLeaf(false);

        this.fileName = newFileName.split('.')[0];

        await leaf.openFile(file);
    }

    private async generateUniqueFileName (baseName: string, extension: string, path: string=""): Promise<string> {
        let index = 0;
        let fileName = `${baseName}.${extension}`;

        while (await this.app.vault.adapter.exists(path ? `${path}/${fileName}` : fileName)) {
            index += 1;
            fileName = `${baseName} ${index}.${extension}`;
        }

        return fileName;
    }

    public async getLibraryFile (): Promise<string> {
        await createIntermediaryFolders(this.app.vault, this.settings.libraryPath);

        if (!(await this.app.vault.adapter.exists(this.settings.libraryPath))) {
            try {
                await this.app.vault.adapter.write(this.settings.libraryPath, NEW_LIBRARY_CONTENT);
            } catch { /*ignore*/}
        }

        return (await this.app.vault.adapter.read(this.settings.libraryPath)) || NEW_LIBRARY_CONTENT;;
    }

    public async setLibraryFile (content: string): Promise<void> {
        await createIntermediaryFolders(this.app.vault, this.settings.libraryPath);
        await this.app.vault.adapter.write(this.settings.libraryPath, content);
    }

    public async setCacheImageFile (fileName: string | undefined, getFileContentAsDataUrl: () => Promise<string>): Promise<void> {
        if (!fileName) return;

        const fileContent = dataUrlToUint8Array(await getFileContentAsDataUrl());
        const cachePath = `${this.settings.cachePath}/${hashPath(fileName)}`;

        await createIntermediaryFolders(this.app.vault, cachePath);
        await this.app.vault.adapter.writeBinary(cachePath, fileContent);
    }
}

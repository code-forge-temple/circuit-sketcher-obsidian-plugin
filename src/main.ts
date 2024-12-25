/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {Plugin, App, PluginManifest, TFile, addIcon} from "obsidian";
import {CIRCUIT_VIEW_TYPE, CircuitSketcherView} from "./CircuitSketcherView";
import {CircuitSketcherSettingTab} from './CircuitSketcherSettingTab';
import icon from './assets/icon.svg';

const FILE_EXTENSION = "circuit-sketcher";

interface CircuitSketcherSettings {
    libraryPath: string;
}

const DEFAULT_SETTINGS: CircuitSketcherSettings = {
    libraryPath: 'circuit-sketcher.lib',
};

export default class CircuitSketcherPlugin extends Plugin {
    settings: CircuitSketcherSettings;

    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest)

        this.createNewCircuitSketcher = this.createNewCircuitSketcher.bind(this);

        this.settings = DEFAULT_SETTINGS;
    }

    async onload () {
        await this.loadSettings();

        this.addSettingTab(new CircuitSketcherSettingTab(this.app, this));

        addIcon('circuit', icon);

        // Register the custom view for `.circuit-sketcher` files
        this.registerView(CIRCUIT_VIEW_TYPE, (leaf) => new CircuitSketcherView(leaf, this));

        // Register `.circuit-sketcher` files to be visible in the file explorer
        this.registerExtensions([FILE_EXTENSION], CIRCUIT_VIEW_TYPE);

        // Add a command to create a new `.circuit-sketcher` file
        this.addCommand({
            id: "circuit-sketcher-create-new",
            name: "Create New Circuit File",
            callback: this.createNewCircuitSketcher,
        });


        this.addRibbonIcon('circuit', 'Create New Circuit Sketcher File', this.createNewCircuitSketcher);
    }

    async onunload () {
    }

    public fileName: string = "";
    private async createNewCircuitSketcher () {
        const newFileName = await this.generateUniqueFileName("New Circuit Sketcher File", FILE_EXTENSION);
        const file = await this.app.vault.create(newFileName, "");
        const leaf = this.app.workspace.getLeaf(false);

        this.fileName = newFileName.split('.')[0];

        await leaf.openFile(file);
    }

    private async generateUniqueFileName (baseName: string, extension: string): Promise<string> {
        let index = 0;
        let fileName = `${baseName}.${extension}`;

        while (await this.app.vault.adapter.exists(fileName)) {
            index += 1;
            fileName = `${baseName} (${index}).${extension}`;
        }

        return fileName;
    }

    async loadSettings () {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings () {
        await this.saveData(this.settings);
    }

    public async getLibraryFile (): Promise<string> {
        if (!(await this.app.vault.adapter.exists(this.settings.libraryPath))) {
            try {
                await this.app.vault.create(this.settings.libraryPath, "");
            } catch { /*ignore*/}
        }

        const libraryFile = this.app.vault.getAbstractFileByPath(this.settings.libraryPath);

        if (libraryFile instanceof TFile) {
            return await this.app.vault.read(libraryFile);
        }

        throw new Error("Library file is not a valid TFile");
    }

    public async setLibraryFile (content: string): Promise<void> {
        if (!(await this.app.vault.adapter.exists(this.settings.libraryPath))) {
            try {
                await this.app.vault.create(this.settings.libraryPath, content);
                return;
            } catch { /*ignore*/ }
        }

        const libraryFile = this.app.vault.getAbstractFileByPath(this.settings.libraryPath);

        if (libraryFile instanceof TFile) {
            await this.app.vault.modify(libraryFile, content);
        } else {
            throw new Error("Library file is not a valid TFile");
        }
    }
}

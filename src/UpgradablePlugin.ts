/************************************************************************
 *    Copyright (C) 2025 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/


import {App, Plugin, PluginManifest} from "obsidian";
import {compareVersions, createIntermediaryFolders} from "./utils/utils";
import {CircuitSketcherSettings} from "./types/types";
import {READONLY_SETTINGS} from "./constants/constants";


export default class UpgradablePlugin extends Plugin {
    settings: CircuitSketcherSettings;

    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.settings = READONLY_SETTINGS;
    }

    async onload () {
        await this.loadSettings();
    }

    async loadSettings () {
        this.settings = Object.assign({}, await this.loadData(), READONLY_SETTINGS);

        const manifestVersion = this.manifest.version;
        const storedVersion = this.settings.dataVersion || "0.0.0";

        if (compareVersions(manifestVersion, storedVersion) > 0) {
            await this.migrateData(storedVersion);

            this.settings.dataVersion = manifestVersion;

            await this.saveSettings();
        }
    }

    async migrateData (storedVersion: string) {
        if(compareVersions("1.2.0", storedVersion) > 0) {
            await this.migrateLibraryFile();
        }
    }

    async saveSettings () {
        await this.saveData(this.settings);
    }

    private async migrateLibraryFile (): Promise<void> {
        const OLD_LIBRARY_PATH = `circuit-sketcher.lib`;
        const migrationNeeded = await this.app.vault.adapter.exists(OLD_LIBRARY_PATH);

        if (migrationNeeded) {
            try {
                await createIntermediaryFolders(this.app.vault, this.settings.libraryPath);
                await this.app.vault.adapter.rename(OLD_LIBRARY_PATH, this.settings.libraryPath);
            } catch {/*ignore*/ }
        }
    }
}
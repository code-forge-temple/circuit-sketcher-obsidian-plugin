/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {PluginSettingTab, App, Setting} from "obsidian";
import CircuitSketcherPlugin from "./main";

export class CircuitSketcherSettingTab extends PluginSettingTab {
    plugin: CircuitSketcherPlugin;

    constructor (app: App, plugin: CircuitSketcherPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display (): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl("h3", {text: "Circuit Sketcher Plugin"});

        new Setting(containerEl)
            .setName("Version")
            .setDesc("Current plugin version")
            .addText(text => text.setValue(this.plugin.manifest.version).setDisabled(true));

        containerEl.createEl("div", {cls: "setting-item-divider"});

        containerEl.createEl("h3", {text: "Library"});
        new Setting(containerEl)
            .setDesc("The Circuit Sketcher library will allow you to save any circuit element custom design you create and make it available throughout any .circuit-sketcher file.");

        new Setting(containerEl)
            .setName("Library path")
            .setDesc(`The Circuit Sketcher library will be stored at: vault_root/${this.plugin.settings.libraryPath}`)
            .addText(text => text.setValue(this.plugin.settings.libraryPath).setDisabled(true));

        containerEl.createEl("div", {cls: "setting-item-divider"});

        containerEl.createEl("h3", {text: "Cache"});

        new Setting(containerEl)
            .setDesc("The Circuit Sketcher cache stores generated circuit images and data to improve performance and reduce redundant computations. " +
                     "It is recommended not to delete the cache, as doing so will cause references to circuit sketches in your notes to become invisible until they are regenerated.");

        new Setting(containerEl)
            .setName("Cache path")
            .setDesc(`The Circuit Sketcher cache will be stored at: vault_root/${this.plugin.settings.cachePath}`)
            .addText(text => text.setValue(this.plugin.settings.cachePath).setDisabled(true));

    }
}
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

        new Setting(containerEl)
            .setName("Library")
            .setDesc("The Circuit Sketcher library will allow you to save any circuit element custom design you create and make it available throughout any .circuit-sketcher file.");

        new Setting(containerEl)
            .setName("Library path")
            .setDesc("The Circuit Sketcher library will be stored at: vault_root/.lib.circuit-sketcher")
            .addText(text => text.setValue(this.plugin.settings.libraryPath).setDisabled(true));
    }
}
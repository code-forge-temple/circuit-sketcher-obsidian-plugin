/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {WorkspaceLeaf, TextFileView} from "obsidian";
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client'
import {App} from "./components/App";
import {CanvasManager} from "circuit-sketcher-core";
import CircuitSketcherPlugin from "./main";
import {LocalStorageManager} from "circuit-sketcher-core";

export const CIRCUIT_VIEW_TYPE = "circuit-sketcher-view";

export class CircuitSketcherView extends TextFileView {
    private plugin: CircuitSketcherPlugin;

    constructor (leaf: WorkspaceLeaf, plugin: CircuitSketcherPlugin) {
        super(leaf);

        this.plugin = plugin;

        CanvasManager.setOnChangeCallback(this.requestSave);
    }

    getViewType () {
        return CIRCUIT_VIEW_TYPE;
    }

    getDisplayText () {
        return "Circuit Sketcher";
    }

    // Set the data to the editor. This is used to load the file contents.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setViewData = async (fileContents: string, clear: boolean) => {
        const viewDomContent = this.containerEl.children[1];
        viewDomContent.innerHTML = ``;

        (viewDomContent as HTMLElement).style.overflow = "hidden"; // important for the canvas to be able to drag on it

        LocalStorageManager.setLibrary(await this.plugin.getLibraryFile());

        createRoot(viewDomContent).render(
            <StrictMode>
                <App fileContents= {fileContents} />
            </StrictMode>,
        );
    }

    // Gets the data from the editor. This will be called to save the editor contents to the file.
    getViewData = (): string => {
        const fileContents = CanvasManager.getInstance().stringify(true);

        this.plugin.setLibraryFile(LocalStorageManager.getLibrary(true));

        return fileContents;
    }

    clear (): void {}

    async onClose () {
        const viewDomContent = this.containerEl.children[1];

        viewDomContent.innerHTML = ``;

        CanvasManager.destroy();
    }
}
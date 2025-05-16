/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {WorkspaceLeaf, TextFileView} from "obsidian";
import React, {StrictMode} from 'react';
import {createRoot, Root} from 'react-dom/client'
import {App} from "./components/App";
import {CanvasManager} from "circuit-sketcher-core";
import CircuitSketcherPlugin from "./main";
import {LocalStorageManager} from "circuit-sketcher-core";
import "./CircuitSketcherView.scss";

export const CIRCUIT_VIEW_TYPE = "circuit-sketcher-view";

export class CircuitSketcherView extends TextFileView {
    private plugin: CircuitSketcherPlugin;
    private root: Root | null = null;

    constructor (leaf: WorkspaceLeaf, plugin: CircuitSketcherPlugin) {
        // #!dev
        console.log("CircuitSketcherView.constructor()");

        super(leaf);

        this.plugin = plugin;

        CanvasManager.setOnChangeCallback(this.requestSave);
    }

    getViewType () {
        return CIRCUIT_VIEW_TYPE;
    }

    getDisplayText () {
        const activeFile = this.app.workspace.getActiveFile();

        if (activeFile) {
            return `${activeFile.basename}`;
        }

        return "Circuit Sketcher";
    }

    // Set the data to the editor. This is used to load the file contents.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setViewData = async (fileContents: string, clear: boolean) => {
        // #!dev
        console.log("CircuitSketcherView.setViewData() - NEW FILE");

        LocalStorageManager.setLibrary(await this.plugin.getLibraryFile());

        const viewDomContent = this.containerEl.children[1];

        this.clear();

        this.root = createRoot(viewDomContent);

        this.root.render(
            <StrictMode>
                <App
                    fileContents= {fileContents}
                    onLoaded={() => {
                        this.plugin.setCacheImageFile(this.file?.path, CanvasManager.getInstance().toPng);
                    }} />
            </StrictMode>,
        );
    }

    // Gets the data from the editor. This will be called to save the editor contents to the file.
    getViewData = (): string => {
        // #!dev
        console.log("CircuitSketcherView.getViewData() - OLD FILE");

        const fileContents = CanvasManager.getInstance().stringify(true);

        this.plugin.setLibraryFile(LocalStorageManager.getLibrary(true));
        this.plugin.setCacheImageFile(this.file?.path, CanvasManager.getInstance().toPng);

        return fileContents;
    }

    // Clear the editor. This is usually called when we're about to open a completely different file, so it's best to clear any editor states like undo-redo history, and any caches/indexes associated with the previous file contents.
    clear (): void {
        // #!dev
        console.log("CircuitSketcherView.clear()");

        CanvasManager.destroy();

        this.clearHtml();
    }

    clearHtml (): void {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }

        const viewDomContent = this.containerEl.children[1];

        while (viewDomContent.firstChild) {
            viewDomContent.removeChild(viewDomContent.firstChild);
        }
    }

    async onClose () {
        // #!dev
        console.log("CircuitSketcherView.onClose()");

        this.clear();
    }
}
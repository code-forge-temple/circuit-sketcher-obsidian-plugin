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
    /* the canvas this view loaded - CanvasManager is a singleton, so clear() or another circuit
     * view can replace it while this view is still around */
    private manager: CanvasManager | null = null;
    // what this view last loaded or saved, handed back while it has no canvas
    private lastData = "";
    // the circuit contents the cached embed image was last made from
    private imageData: string | null = null;

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

        // until the new canvas is loaded, a save must return this file's own contents
        this.manager = null;
        this.lastData = fileContents;

        await LocalStorageManager.setLibrary(await this.plugin.getLibraryFile());

        const viewDomContent = this.containerEl.children[1];

        this.clear();

        this.root = createRoot(viewDomContent);

        this.root.render(
            <StrictMode>
                <App
                    fileContents= {fileContents}
                    onLoaded={() => {
                        this.manager = CanvasManager.getInstance();
                        this.imageData = fileContents;
                        this.plugin.setCacheImageFile(this.file?.path, this.manager.toPng);
                    }} />
            </StrictMode>,
        );
    }

    // Gets the data from the editor. This will be called to save the editor contents to the file.
    getViewData = (): string => {
        // #!dev
        console.log("CircuitSketcherView.getViewData() - OLD FILE");

        /* no canvas loaded for this view (still loading, or clear() destroyed it): getInstance()
         * would create an empty one, and its "[]" would be saved over the file */
        if (!this.manager) return this.lastData;

        // this view's own canvas, not getInstance(): another circuit view may have replaced it
        const fileContents = this.manager.stringify(true);

        this.lastData = fileContents;

        LocalStorageManager.getLibrary(true).then((library) => {
            this.plugin.setLibraryFile(library);
        });

        // the embed image only changes with the circuit, and exporting it briefly clears the selection
        if (fileContents !== this.imageData) {
            this.imageData = fileContents;
            this.plugin.setCacheImageFile(this.file?.path, this.manager.toPng);
        }

        return fileContents;
    }

    // Clear the editor. This is usually called when we're about to open a completely different file, so it's best to clear any editor states like undo-redo history, and any caches/indexes associated with the previous file contents.
    clear (): void {
        // #!dev
        console.log("CircuitSketcherView.clear()");

        // keep the latest edits - a save can still come after the canvas is gone
        if (this.manager) {
            this.lastData = this.manager.stringify(true);
            this.manager = null;
        }

        CanvasManager.destroy();

        this.imageData = null;

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
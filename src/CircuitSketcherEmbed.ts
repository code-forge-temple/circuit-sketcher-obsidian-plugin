/************************************************************************
 *    Copyright (C) 2026 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {App, Component, Keymap, TFile, setIcon} from "obsidian";
import "./CircuitSketcherEmbed.scss";

// what Obsidian hands an embed: where to draw it, and the link it was made from
export type EmbedContext = {
    app: App;
    containerEl: HTMLElement;
    linktext: string;
    sourcePath: string;
};

type Embed = Component & {loadFile (): Promise<void> | void};

export type EmbedCreator = (context: EmbedContext, file: TFile, subpath: string) => Embed;

declare module "obsidian" {
    interface App {
        /* Not part of Obsidian's published API: how it picks the embed for a file type. Canvas cards,
         * Live Preview and hover previews all go through it, so may be missing in a future version. */
        embedRegistry?: {
            registerExtension (extension: string, creator: EmbedCreator): void;
            unregisterExtension (extension: string): void;
        };
    }
}

export type EmbedImageSource = {
    // the url of the circuit's cached picture, fresh on every call
    cacheImageUrl (filePath: string): string;
    watchEmbed (embed: CircuitSketcherEmbed): void;
    unwatchEmbed (embed: CircuitSketcherEmbed): void;
};

/* A circuit shown where Obsidian embeds a file: its cached picture - the one the plugin saves with
 * every change, also shown in notes - or, while there is none, the file's name.
 */
export class CircuitSketcherEmbed extends Component implements Embed {
    private imageEl: HTMLImageElement | null = null;
    private missingEl: HTMLElement | null = null;

    constructor (private context: EmbedContext, readonly file: TFile, private images: EmbedImageSource) {
        super();
    }

    loadFile (): void {
        const {app, containerEl, linktext, sourcePath} = this.context;

        containerEl.addClass("media-embed", "circuit-sketcher-embed");

        this.imageEl = containerEl.createEl("img");
        this.missingEl = containerEl.createDiv({cls: "circuit-sketcher-embed-missing"}, (el) => {
            setIcon(el.createSpan({cls: "circuit-sketcher-embed-icon"}), "circuit");
            el.createSpan({text: this.file.basename});
            el.createDiv({cls: "circuit-sketcher-embed-hint", text: "Open the circuit once to make its picture"});
        });
        this.missingEl.hide();

        // no picture yet (the circuit hasn't been saved since the cache was emptied)
        this.imageEl.onerror = () => {
            this.imageEl?.hide();
            this.missingEl?.show();
        };
        this.imageEl.onload = () => {
            this.missingEl?.hide();
            this.imageEl?.show();
        };

        // like the generic file embed: a click opens the circuit, Ctrl/Cmd+click in a new tab
        this.registerDomEvent(containerEl, "click", (event) => {
            void app.workspace.openLinkText(linktext, sourcePath, Keymap.isModEvent(event));
        });

        this.images.watchEmbed(this);
        this.refresh();
    }

    // shows the picture as it is now - called again whenever the plugin saves a new one
    refresh (): void {
        if (this.imageEl) {
            this.imageEl.src = this.images.cacheImageUrl(this.file.path);
        }
    }

    onunload (): void {
        this.images.unwatchEmbed(this);
    }
}

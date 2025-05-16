/************************************************************************
 *    Copyright (C) 2025 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {Vault} from "obsidian";

export function hashPath (path: string): string {
    let hash = 0, i, chr;

    for (i = 0; i < path.length; i++) {
        chr = path.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash.toString();
}

export function dataUrlToUint8Array (dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1];
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
}

export const createIntermediaryFolders = async (vault: Vault, fullPath: string): Promise<void> => {
    const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'))
    const parts = folderPath.split('/');
    let currentPath = '';

    for (const part of parts) {
        if (!part) continue;

        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!(await vault.adapter.exists(currentPath))) {
            try {
                await vault.createFolder(currentPath);
            } catch { /*ignore*/ }
        }
    }
}

export function compareVersions (a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        const diff = (aParts[i] || 0) - (bParts[i] || 0);

        if (diff !== 0) return diff;
    }
    return 0;
}
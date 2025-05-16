/************************************************************************
 *    Copyright (C) 2025 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import {CircuitSketcherSettings} from "../types/types";

export const FILE_EXTENSION = "circuit-sketcher";
export const BASE_FOLDER = ".circuit-sketcher";
export const NEW_LIBRARY_CONTENT = "{}";
export const CREATE_FILE_COMMAND = "Create new Circuit Sketcher file";

export const READONLY_SETTINGS: CircuitSketcherSettings = {
    libraryPath: `${BASE_FOLDER}/circuit-sketcher.lib`,
    cachePath: `${BASE_FOLDER}/circuit-sketcher.cache`,
};
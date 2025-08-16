# circuit-sketcher-obsidian-plugin

**A plugin for Obsidian to draw circuits on a canvas. It is based on the [code-forge-temple/circuit-sketcher-core](https://github.com/code-forge-temple/circuit-sketcher-core).**  

> ⭐️ **Love this project?** Please consider [starring the repository](https://github.com/code-forge-temple/circuit-sketcher-obsidian-plugin) on GitHub and [supporting development](https://github.com/sponsors/code-forge-temple) to help me continue building amazing features!

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Obsidian](https://img.shields.io/badge/Obsidian-483699?logo=obsidian&logoColor=white)](https://docs.obsidian.md/)
[![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=white)](https://webpack.js.org/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

[![Circuit Sketcher Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2FHEAD%2Fcommunity-plugin-stats.json&query=%24.%5B%22circuit-sketcher%22%5D.downloads&style=for-the-badge&label=Circuit%20Sketcher%20Downloads)](https://www.obsidianstats.com/plugins/circuit-sketcher)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Component Library](#component-library)
- [License](#license)

## Features

- Draw and edit circuit diagrams directly within Obsidian.
- Save and load circuit designs.
- Customizable library for circuit elements.
- Responsive design with automatic resizing.
- **Embed circuit diagrams in notes:** Reference `.circuit-sketcher` files in your notes (e.g., by dragging and dropping the file into a note). In read mode, an image of the circuit will be displayed automatically.

## Installation

1. Open [Obsidian](https://obsidian.md) and go to `Settings` ⇒ `Community Plugins` ⇒ `Browse`.
2. Search for `Circuit Sketcher`.
3. Select the `Circuit Sketcher` plugin and press `Install`, then press `Enable`.

or

1. Open [Community Plugins Page](https://obsidian.md/plugins?id=circuit-sketcher) in browser.
2. Select `Install`, then press `Enable`.

## Usage

1. Use the ribbon icon, command palette, or right-click on a target folder in the file explorer and select **Create new Circuit Sketcher file** to create a new circuit sketcher file.
2. Start drawing your circuit on the canvas:
    - On the canvas, right-click to show the canvas menu, and select `Create Node`.
    - Right-click on the node to show the node menu, select `Change Image`, and choose an image relevant to your circuit node.
    - Right-click on the node to show the node menu, select `Add Port...`, and choose the port location and type.
    - You can rename the circuit node label or port label by double-clicking on the label. The port or port label can also be deleted (right-click on the port to show the port menu and proceed from there).
    - You can relocate ports, either to a different node side or rearrange the ports on the same side, by dragging and dropping the port to the desired location within the dotted blue area.
    - After you are satisfied with your changes to the circuit node, and if you wish to save the circuit node to reuse it in the current or a different `.circuit-sketcher` file, you can right-click on the circuit node and press `Save Node to Library` (this will update the root Obsidian vault `circuit-sketcher.lib` file).
    - You can reuse the node by right-clicking on the canvas and selecting `Library...` then selecting the desired node.
    - Connections between circuit nodes can be made by dragging and dropping one port to the destination port (if it is a compatible port). You can delete a connection by selecting it and then pressing the Delete key.
    - You can drag the entire circuit by holding the mouse scroll button and moving the mouse.

A short video tutorial on how to use the plugin:

[<img src="https://img.youtube.com/vi/S6ifgDb83Pg/maxresdefault.jpg" alt="Watch Demo Video" width="600">](https://www.youtube.com/watch?v=S6ifgDb83Pg)

## Component Library

To help you get started with Circuit Sketcher, we provide a curated library of circuit components at [circuit-sketcher-lib](https://github.com/code-forge-temple/circuit-sketcher-lib).

### Quick Start with Pre-built Components

**Import the entire library:**
- Download the complete component library: [library.json](https://github.com/code-forge-temple/circuit-sketcher-lib/blob/main/assets/lib/library.json)
- Import it directly into Circuit Sketcher to get access to all available components (right click on canvas to show the menu, then `Library...` -> `Import Library`)

**Import individual components:**
- Browse individual components: [assets/nodes](https://github.com/code-forge-temple/circuit-sketcher-lib/tree/main/assets/nodes)
- Download specific `.json` files for the components you need
- Import them one by one into your Circuit Sketcher workspace (right click on canvas to show the menu, then `Import Node`)

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

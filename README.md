# circuit-sketcher-obsidian-plugin
A plugin for Obsidian to draw circuits on a canvas.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- Draw and edit circuit diagrams directly within Obsidian.
- Save and load circuit designs.
- Customizable library for circuit elements.
- Responsive design with automatic resizing.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/code-forge-temple/circuit-sketcher-obsidian-plugin.git
    ```

2. Navigate to the project directory:
    ```sh
    cd circuit-sketcher-obsidian-plugin
    ```

3. Set the Node.js version:
    - For Unix-based systems:
        ```sh
        nvm use
        ```
    - For Windows:
        ```sh
        nvm use $(cat .nvmrc)
        ```

4. Install dependencies:
    ```sh
    npm install
    ```

5. Build the project:
    ```sh
    npm run build
    ```

## Usage

1. Copy the contents of the `./dist` folder (it contains the `circuit-sketcher` folder) into `<your Obsidian vault location>/.obsidian/plugins/`.
2. Open Obsidian and go to `Settings` ⇒ `Community Plugins`. If you do not see `Circuit Sketcher`, press the `Installed plugins` refresh button, then activate the plugin.
3. Use the ribbon icon or command palette to create a new circuit sketcher file.
4. Start drawing your circuit on the canvas:
    - On the canvas, right-click to show the canvas menu, and select `Create Node`.
    - Right-click on the node to show the node menu, and select `Change Image` and select an image relevant to your circuit node.
    - Right-click on the node to show the node menu, and select `Add Port` and select the port location and type.
    - You can rename the circuit node label or port label by double-clicking on the label. The port or port label can also be deleted (right-click on the port to show the port menu and go from there).
    - After you are satisfied with your changes to the circuit node, and if you wish to save the circuit node to be able to reuse it in the current or a different `.circuit-sketcher` file, you can right-click on the circuit node and press `Save Node to Library` (this will update the root Obsidian vault `circuit-sketcher.lib` file).
    - You can reuse the node by right-clicking on the canvas and selecting `Add Node from Library`.
    - The connections between circuit nodes can be done by drag-and-dropping one port to the destination port (if it is a compatible port).

      https://github.com/user-attachments/assets/0fa80533-857d-47c8-913f-1f46e923117c

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import React, {Suspense, useEffect, useState} from "react";
import "./App.scss";
import {DrawBoardProps} from "../DrawBoard/DrawBoard";


export const App = (props: DrawBoardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [DrawBoard, setDrawBoard] = useState<React.ComponentType<DrawBoardProps> | null>(null);
    const loadingElement = (
        <div className="circuit-sketcher-plugin">
            <div className="spinner-container">
                <div className="spinner" />
            </div>
        </div>
    );

    useEffect(() => {
        import("../DrawBoard").then(module => {
            setDrawBoard(() => module.DrawBoard);
            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded || !DrawBoard) {
        return loadingElement;
    }

    return (
        <div className="circuit-sketcher-plugin">
            <Suspense fallback={loadingElement}>
                <DrawBoard {...props} />
            </Suspense>
        </div>
    );
};
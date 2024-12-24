/************************************************************************
 *    Copyright (C) 2024 Code Forge Temple                              *
 *    This file is part of circuit-sketcher-obsidian-plugin project.    *
 *    Licensed under the GNU General Public License v3.0.               *
 *    See the LICENSE file in the project root for more information.    *
 ************************************************************************/

import React, {useEffect, useRef} from "react";
import {CanvasManager, ModalAddImage} from "circuit-sketcher-core";
import './DrawBoard.scss';

export type DrawBoardProps = {
    fileContents: string;
};

const CANVAS_ID = "circuit-board";

export const DrawBoard = ({fileContents}: DrawBoardProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const resizeTimeoutRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        CanvasManager.setCanvasId(CANVAS_ID).getInstance().parse(fileContents);
    }, [fileContents]);

    const handleResize = () => {
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = window.setTimeout(async () => {
            if (canvasRef.current) {
                const jsonStr = await CanvasManager.getInstance().stringify();

                CanvasManager.getInstance().parse(jsonStr);
            }
        }, 300);
    };

    useEffect(() => {
        const observer = new ResizeObserver(handleResize);
        const currentContainer = containerRef.current;

        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="canvas-container" ref={containerRef}>
            <ModalAddImage />
            <div className="canvas" id={CANVAS_ID} ref={canvasRef}></div>
        </div>
    );
};

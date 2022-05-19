import React, { useEffect, useRef, useState } from 'react';
import {
    BiCircle,
    BiEraser,
    BiImage,
    BiMove,
    BiPencil,
    BiRectangle,
    BiText
} from 'react-icons/all';
import { IconContext } from 'react-icons';
import { Toolbox, WhiteboardBlock } from '@/components/Whiteboard/style';
import CanvasBoard from '@/components/Whiteboard/CanvasBoard';
import useCanvasContext from '@/components/Whiteboard/useCanvasContext';
import { ToolType } from '@/components/Whiteboard/types';

interface ToolBoxButton {
    tool: ToolType;
    icon: React.ReactNode;
}

const tools: ToolBoxButton[] = [
    {
        tool: 'pencil',
        icon: <BiPencil />
    },
    {
        tool: 'eraser',
        icon: <BiEraser />
    },
    {
        tool: 'move',
        icon: <BiMove />
    },
    {
        tool: 'rectangle',
        icon: <BiRectangle />
    },
    {
        tool: 'circle',
        icon: <BiCircle />
    },
    {
        tool: 'text',
        icon: <BiText />
    },
    {
        tool: 'image',
        icon: <BiImage />
    }
];

export default function Whiteboard() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { canvasRef, events, canvasCtx, setCanvasCtx, repaint } =
        useCanvasContext();
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    useEffect(() => {
        const calculateCanvasSize = () => {
            if (canvasContainerRef.current) {
                setCanvasWidth(canvasContainerRef.current.clientWidth);
                setCanvasHeight(canvasContainerRef.current.clientHeight);
            }
        };
        calculateCanvasSize();
        window.addEventListener('resize', calculateCanvasSize);
        return () => {
            window.removeEventListener('resize', calculateCanvasSize);
        };
    });

    return (
        <WhiteboardBlock ref={canvasContainerRef}>
            <CanvasBoard
                canvasRef={canvasRef}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                events={events}
                repaint={repaint}
            />
            <IconContext.Provider
                value={{ color: 'var(--primary)', size: '28px' }}
            >
                <Toolbox>
                    {tools.map((toolEnt, idx) => {
                        return (
                            <li
                                key={idx}
                                className={
                                    canvasCtx.tool === toolEnt.tool
                                        ? 'selected'
                                        : ''
                                }
                                onClick={() => {
                                    setCanvasCtx((prev) => ({
                                        ...prev,
                                        tool: toolEnt.tool
                                    }));
                                }}
                            >
                                {toolEnt.icon}
                            </li>
                        );
                    })}
                </Toolbox>
            </IconContext.Provider>
        </WhiteboardBlock>
    );
}

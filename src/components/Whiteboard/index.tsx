import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    MdRedo,
    MdUndo,
    RiDragMove2Fill,
    RiEraserFill,
    RiPencilFill
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
        icon: <RiPencilFill />
    },
    {
        tool: 'eraser',
        icon: <RiEraserFill />
    },
    {
        tool: 'move',
        icon: <RiDragMove2Fill />
    }
];

export default function Whiteboard() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { canvasRef, events, canvasCtx, setCanvasCtx } = useCanvasContext();
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const doUndo = useCallback(() => {}, []);

    const doRedo = useCallback(() => {}, []);

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
                    <li onClick={() => doUndo()}>
                        <MdUndo />
                    </li>
                    <li onClick={() => doRedo()}>
                        <MdRedo />
                    </li>
                </Toolbox>
            </IconContext.Provider>
        </WhiteboardBlock>
    );
}

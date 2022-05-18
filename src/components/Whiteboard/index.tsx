import React, { useEffect, useRef, useState } from 'react';
import {
    MdRedo,
    MdUndo,
    RiDragMove2Fill,
    RiEraserFill,
    RiPencilFill
} from 'react-icons/all';
import { IconContext } from 'react-icons';
import { Toolbox, WhiteboardBlock } from '@/components/Whiteboard/style';
import CanvasBoard, { Tool } from '@/components/Whiteboard/CanvasBoard';
import { PaintStyle } from '@/components/Whiteboard/DrawContext';

interface ToolBoxButton {
    tool: Tool;
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
    const [tool, setTool] = useState<Tool>('pencil');
    const [lineStyle, setLineStyle] = useState<PaintStyle>({
        color: 'black',
        thickness: 4
    });
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
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                tool={tool}
                lineStyle={lineStyle}
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
                                    tool === toolEnt.tool ? 'selected' : ''
                                }
                                onClick={() => setTool(toolEnt.tool)}
                            >
                                {toolEnt.icon}
                            </li>
                        );
                    })}
                    <li>
                        <MdUndo />
                    </li>
                    <li>
                        <MdRedo />
                    </li>
                </Toolbox>
            </IconContext.Provider>
        </WhiteboardBlock>
    );
}

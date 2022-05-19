import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    BiCircle,
    BiEraser,
    BiImage,
    BiMove,
    BiPalette,
    BiPencil,
    BiRectangle,
    BiText,
    BiTrash,
    BiZoomIn,
    BiZoomOut
} from 'react-icons/all';
import { IconContext } from 'react-icons';
import {
    Seperator,
    Toolbox,
    WhiteboardBlock
} from '@/components/Whiteboard/style';
import CanvasBoard from '@/components/Whiteboard/CanvasBoard';
import useCanvasContext from '@/components/Whiteboard/useCanvasContext';
import { ToolType } from '@/components/Whiteboard/types';
import Modal, { Action } from '@/components/Modal';

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
    const [clearModalOpen, setClearModalOpen] = useState(false);

    const onCloseClearDialog = useCallback(
        (action: Action) => {
            if (action === 'yes') {
                setCanvasCtx((prev) => ({
                    ...prev,
                    elements: []
                }));
            }
            setClearModalOpen(false);
        },
        [setCanvasCtx]
    );

    const onZoomIn = useCallback(() => {
        setCanvasCtx((prev) => ({
            ...prev,
            zoom: prev.zoom + 0.25
        }));
    }, [setCanvasCtx]);

    const onZoomOut = useCallback(() => {
        setCanvasCtx((prev) => ({
            ...prev,
            zoom: prev.zoom - 0.25
        }));
    }, [setCanvasCtx]);

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
            <Modal
                isOpen={clearModalOpen}
                onAction={onCloseClearDialog}
                buttons="yesno"
            >
                보드를 모두 지웁니다.
            </Modal>
            <CanvasBoard
                canvasRef={canvasRef}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                events={events}
                repaint={repaint}
            />
            <IconContext.Provider value={{ size: '28px' }}>
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
                    <Seperator />
                    <li onClick={() => setClearModalOpen(true)}>
                        <BiTrash />
                    </li>
                    <li>
                        <BiZoomIn onClick={onZoomIn} />
                    </li>
                    <li>
                        <BiZoomOut onClick={onZoomOut} />
                    </li>
                    <li>
                        <BiPalette />
                    </li>
                </Toolbox>
            </IconContext.Provider>
        </WhiteboardBlock>
    );
}

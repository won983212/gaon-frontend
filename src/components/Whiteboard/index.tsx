import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    BiCircle,
    BiEraser,
    BiMove,
    BiPalette,
    BiPencil,
    BiRectangle,
    BiSearch,
    BiText,
    BiTrash
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
import ZoomMenu from '@/components/Whiteboard/ZoomMenu';
import PaletteMenu from '@/components/Whiteboard/PaletteMenu';

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
    }
];

export default function Whiteboard() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { canvasRef, events, canvasCtx, setCanvasCtx, repaint } =
        useCanvasContext();
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
    const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);

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

    const canvasLeft = canvasRef.current ? canvasRef.current.offsetLeft : 0;
    const canvasTop = canvasRef.current ? canvasRef.current.offsetTop : 0;

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
            <ZoomMenu
                open={zoomMenuOpen}
                onClose={() => setZoomMenuOpen(false)}
                left={canvasLeft + 12}
                top={canvasTop + 64}
                canvasCtx={canvasCtx}
                setCanvasCtx={setCanvasCtx}
            />
            <PaletteMenu
                open={paletteMenuOpen}
                onClose={() => setPaletteMenuOpen(false)}
                left={canvasLeft + 12}
                top={canvasTop + 64}
                canvasCtx={canvasCtx}
                setCanvasCtx={setCanvasCtx}
            />
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
                    <li onClick={() => setZoomMenuOpen(true)}>
                        <BiSearch />
                    </li>
                    <li onClick={() => setPaletteMenuOpen(true)}>
                        <BiPalette />
                    </li>
                </Toolbox>
            </IconContext.Provider>
        </WhiteboardBlock>
    );
}

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
    BiTrash,
    MdHorizontalRule
} from 'react-icons/all';
import { IconContext } from 'react-icons';
import {
    Seperator,
    Toolbox,
    WhiteboardBlock
} from '@/components/Whiteboard/style';
import CanvasBoard from '@/components/Whiteboard/components/CanvasBoard';
import useCanvasContext from '@/components/Whiteboard/useCanvasContext';
import Modal, { Action } from '@/components/Modal';
import ZoomMenu from '@/components/Whiteboard/components/ZoomMenu';
import PaletteMenu from '@/components/Whiteboard/components/PaletteMenu';
import TextInputMenu from '@/components/Whiteboard/components/TextInputMenu';
import { TextElement } from '@/components/Whiteboard/elements/TextElement';
import { Position } from '@/types';
import { getDeserializer, ToolType } from '@/components/Whiteboard/registry';
import { SerializedDrawElement } from '@/components/Whiteboard/types';
import {
    AbstractDrawElement,
    ElementIdentifier
} from '@/components/Whiteboard/elements/AbstractDrawElement';
import useRoom from '@/hooks/useRoom';
import useSocket from '@/hooks/useSocket';

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
        tool: 'line',
        icon: <MdHorizontalRule />
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
    const { channelId, workspaceId } = useRoom();
    const [socket] = useSocket(workspaceId);

    // canvas state
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    // modal, menu state
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [textInputMenuOpen, setTextInputMenuOpen] = useState(false);
    const [textInputMenuPos, setTextInputMenuPos] = useState<Position>({
        x: 0,
        y: 0
    });
    const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
    const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);

    const onAppendElement = useCallback((element: AbstractDrawElement) => {
        socket.emit('paint', element.serialize());
    }, [socket]);

    const onRemoveElement = useCallback((id: ElementIdentifier) => {
        socket.emit('remove-paint', id);
    }, [socket]);

    const { canvasRef, events, canvasCtx, setCanvasCtx, actions, mousePos } =
        useCanvasContext({
            onAppendElement,
            onRemoveElement
        });

    const onCloseClearDialog = useCallback(
        (action: Action) => {
            if (action === 'yes') {
                setCanvasCtx((prev) => ({
                    ...prev,
                    elements: []
                }));
            }
            setClearModalOpen(false);
            socket.emit('clear-paints');
        },
        [setCanvasCtx, socket]
    );

    const onCloseTextInputMenu = useCallback(
        (text: string) => {
            const element: TextElement =
                canvasCtx.drawingElement as TextElement;
            const newElement = new TextElement(
                element.id,
                element.pos,
                text,
                element.style,
                element.highlight
            );

            setTextInputMenuOpen(false);
            actions.appendDrawingElement(newElement);
            actions.unboundDrawingElement();
        },
        [actions, canvasCtx.drawingElement]
    );

    const onNewPaint = useCallback((element: SerializedDrawElement) => {
        if (element) {
            const newElement = getDeserializer(element.type)(element, false);
            setCanvasCtx((prev) => ({
                ...prev,
                elements: prev.elements.concat(newElement)
            }));
        }
    }, [setCanvasCtx]);

    const onRemovePaint = useCallback((id: ElementIdentifier) => {
        if (id) {
            setCanvasCtx((prev) => ({
                ...prev,
                elements: prev.elements.filter((element) => element.id !== id)
            }));
        }
    }, [setCanvasCtx]);

    const onClearPaints = useCallback(() => {
        setCanvasCtx((prev) => ({
            ...prev,
            elements: []
        }));
    }, [setCanvasCtx]);

    useEffect(() => {
        socket.on('paint', onNewPaint);
        socket.on('remove-paint', onRemovePaint);
        socket.on('clear-paints', onClearPaints);
        return () => {
            socket.off('paint', onNewPaint);
            socket.off('remove-paint', onRemovePaint);
            socket.off('clear-paints', onClearPaints);
        };
    }, [socket, onNewPaint, onRemovePaint, onClearPaints]);

    useEffect(() => {
        socket.emit('select-paints', channelId, (paints: SerializedDrawElement[]) => {
            setCanvasCtx((prev) => ({
                ...prev,
                elements: paints.map((serialized) =>
                    getDeserializer(serialized.type)(serialized, false))
            }));
        });
        setCanvasCtx((prev) => ({
            ...prev,
            elements: []
        }));
    }, [channelId, setCanvasCtx, socket]);

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

    useEffect(() => {
        if (canvasCtx.drawingElement instanceof TextElement) {
            setTextInputMenuOpen(true);
            if (canvasRef.current) {
                setTextInputMenuPos({
                    x: mousePos.x + canvasRef.current.offsetLeft,
                    y: mousePos.y + canvasRef.current.offsetTop - 12
                });
            }
        }
    }, [canvasCtx.drawingElement, canvasRef, mousePos]);

    return (
        <WhiteboardBlock ref={canvasContainerRef}>
            <ZoomMenu
                open={zoomMenuOpen}
                onClose={() => setZoomMenuOpen(false)}
                left={canvasLeft + 64}
                top={canvasTop + 256}
                canvasCtx={canvasCtx}
                setCanvasCtx={setCanvasCtx}
            />
            <PaletteMenu
                open={paletteMenuOpen}
                onClose={() => setPaletteMenuOpen(false)}
                left={canvasLeft + 64}
                top={canvasTop + 198}
                canvasCtx={canvasCtx}
                setCanvasCtx={setCanvasCtx}
            />
            <TextInputMenu
                open={textInputMenuOpen}
                onClose={onCloseTextInputMenu}
                left={textInputMenuPos.x}
                top={textInputMenuPos.y}
            />
            <Modal
                isOpen={clearModalOpen}
                onAction={onCloseClearDialog}
                buttons='yesno'
            >
                보드를 모두 지웁니다.
            </Modal>
            <CanvasBoard
                canvasRef={canvasRef}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                events={events}
                repaint={actions.repaint}
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

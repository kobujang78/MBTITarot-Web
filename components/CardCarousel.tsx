import React, { useState, useEffect, useRef } from 'react';
import { TarotCard } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CARD_BACK_IMAGE_URL } from '../constants';

interface CardCarouselProps {
    cards: TarotCard[];
    onSelect: (card: TarotCard) => void;
    onRotate?: () => void;
}

const CardCarousel: React.FC<CardCarouselProps> = React.memo(({ cards, onSelect, onRotate }) => {
    const [activeIndex, setActiveIndex] = useState(Math.floor(cards.length / 2));

    // Drag/Swipe State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragX, setDragX] = useState(0); // Current drag offset in pixels
    const lastHeardIndexRef = useRef(Math.floor(cards.length / 2));

    const containerRef = useRef<HTMLDivElement>(null);

    // Reset index if out of bounds
    useEffect(() => {
        if (activeIndex >= cards.length) {
            setActiveIndex(Math.max(0, cards.length - 1));
        }
    }, [cards.length]);

    const handleNext = () => {
        if (activeIndex < cards.length - 1) {
            setActiveIndex(prev => prev + 1);
            onRotate?.();
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
            onRotate?.();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Enter' || e.key === ' ') {
                if (cards[activeIndex]) onSelect(cards[activeIndex]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, cards, onSelect]);

    // Wheel navigation
    const handleWheel = (e: React.WheelEvent) => {
        // Prevent default scrolling if needed, but horizontal usually safe
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 0) handleNext();
            else handlePrev();
        } else {
            // Vertical scroll, maybe swipe next/prev too?
            if (e.deltaY > 0) handleNext();
            else handlePrev();
        }
    };

    // --- Drag Handlers ---

    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setDragX(0);
        lastHeardIndexRef.current = activeIndex;
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        const currentDrag = clientX - startX;
        setDragX(currentDrag);

        // Sound feedback during drag
        const threshold = 50;
        const virtualChange = Math.round(-currentDrag / threshold);
        const virtualIndex = Math.min(Math.max(activeIndex + virtualChange, 0), cards.length - 1);

        if (virtualIndex !== lastHeardIndexRef.current) {
            onRotate?.();
            lastHeardIndexRef.current = virtualIndex;
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Threshold to change card: e.g., 50px
        const threshold = 50;
        const change = Math.round(-dragX / threshold); // Dragging Left (negative offset) -> Increase Index (Next)

        if (change !== 0) {
            const newIndex = Math.min(Math.max(activeIndex + change, 0), cards.length - 1);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
                onRotate?.();
            }
        }

        setDragX(0);
    };

    // Mouse Events
    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onMouseLeave = () => { if (isDragging) handleDragEnd(); };

    // Touch Events
    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();


    return (
        <div
            className="relative w-full h-[400px] flex flex-col items-center justify-center overflow-hidden touch-pan-y"
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={containerRef}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
            {/* 3D Scene Container */}
            <div
                className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-[1000px]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {cards.map((card, index) => {
                    // Calculate basic offset from index
                    const baseOffset = index - activeIndex;

                    // Add drag influence (mapped: 50px = 1 unit offset)
                    // Dragging RIGHT (positive dragX) should move cards RIGHT (positive visual offset) -> effectively seeing PREVIOUS cards
                    const dragOffsetValues = dragX / 50;

                    const effectiveOffset = baseOffset + dragOffsetValues;
                    const absOffset = Math.abs(effectiveOffset);

                    // Optimization: Render wider window during drag
                    if (absOffset > 9) return null;

                    // Carousel Mathematics
                    const rotateY = effectiveOffset * 15;
                    const translateX = effectiveOffset * 50;
                    const translateZ = -absOffset * 80;
                    const rotateZ = -effectiveOffset * 2;

                    const scale = Math.max(0, 1 - absOffset * 0.05);
                    const zIndex = 100 - Math.round(absOffset); // zIndex must be int
                    const opacity = Math.max(0, 1 - absOffset * 0.15);

                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={card.id}
                            className={`
                                absolute transition-transform duration-75 ease-out cursor-pointer select-none
                                ${isActive && !isDragging ? 'hover:scale-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]' : ''}
                            `}
                            style={{
                                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                                zIndex: zIndex,
                                opacity: opacity,
                                width: '160px',
                                height: '260px',
                                transformStyle: 'preserve-3d',
                                // Disable transition during drag for responsiveness
                                transition: isDragging ? 'none' : 'all 0.3s ease-out'
                            }}
                            onClick={(e) => {
                                if (Math.abs(dragX) > 5) return; // Ignore click if dragging
                                if (isActive) {
                                    onSelect(card);
                                } else {
                                    setActiveIndex(index);
                                    onRotate?.();
                                }
                            }}
                        >
                            {/* Card Face */}
                            <div className={`
                                w-full h-full rounded-xl border border-slate-600 shadow-2xl overflow-hidden bg-slate-800 
                                relative group transition-colors duration-300 pointer-events-none
                                ${isActive ? 'border-slate-300' : 'border-slate-700 opacity-80'}
                            `}>
                                {/* Pointer events none on children to let parent handle drag clicks */}

                                <img
                                    src={CARD_BACK_IMAGE_URL}
                                    alt="Card Back"
                                    className="w-full h-full object-fill filter contrast-125 group-hover:contrast-100 transition-all"
                                />

                                <div className={`
                                    absolute inset-0 bg-black/20 transition-all duration-300
                                    ${isActive ? 'opacity-0' : 'opacity-60'}
                                `}></div>

                                {isActive && !isDragging && (
                                    <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse"></div>
                                )}

                                {isActive && !isDragging && (
                                    <div className="absolute inset-x-0 bottom-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md bg-black/50 px-3 py-1 rounded-full">
                                            Pick
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-4 flex items-center gap-6 z-50 bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-700 shadow-lg pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={activeIndex === 0}
                    className="p-2 rounded-full hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <span className="text-sm font-serif text-slate-400 min-w-[60px] text-center font-bold tracking-widest select-none">
                    {activeIndex + 1} / {cards.length}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    disabled={activeIndex === cards.length - 1}
                    className="p-2 rounded-full hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="absolute bottom-16 text-xs text-slate-500/60 font-medium tracking-wide pointer-events-none select-none">
                Drag to rotate • Click center to Select
            </div>
        </div>
    );
});

export default CardCarousel;

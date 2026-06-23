'use client';
/**
 * LiquidPullToRefresh
 *
 * Wraps a header + scrollable content. When the user pulls down from the top,
 * the header's bottom edge morphs into a liquid drip using SVG path animation
 * driven by spring physics. A spinner arc appears at the drip tip.
 */
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// Spring physics (Verlet integration)
interface SpringState { value: number; velocity: number }

function springStep(
  s: SpringState,
  target: number,
  dt: number,
  stiffness = 180,
  damping = 18,
  mass = 0.8,
): SpringState {
  const force = -stiffness * (s.value - target) - damping * s.velocity;
  const acc = force / mass;
  const velocity = s.velocity + acc * dt;
  const value = s.value + velocity * dt;
  return { value, velocity };
}

// How many px the SVG overlaps upward into the header to hide the seam.
const OVERLAP = 48;
// Border radius matching rounded-b-[2.5rem] = 40px
const R = 40;
// Radius of the rounded tip at the bottom of the drip
const TIP_R = 10;

// Build the main drip fill path.
// Coordinate space: y=0 is OVERLAP px above header bottom; y=OVERLAP = header bottom edge.
function buildDripPath(w: number, pull: number): string {
  const base = OVERLAP;

  if (pull < 0.5) {
    return [
      `M 0 0 L ${w} 0`,
      `L ${w} ${base - R} Q ${w} ${base} ${w - R} ${base}`,
      `L ${R} ${base} Q 0 ${base} 0 ${base - R}`,
      `Z`,
    ].join(' ');
  }

  const tipY = base + pull - TIP_R; // center of the rounded tip circle
  const spread = Math.min(w * 0.34, 60 + pull * 0.5);
  const cpY = base + pull * 0.5;

  return [
    `M 0 0 L ${w} 0`,
    // right wall → bottom-right rounded corner
    `L ${w} ${base - R} Q ${w} ${base} ${w - R} ${base}`,
    // right shoulder → right side of tip arc
    `C ${w / 2 + spread} ${base} ${w / 2 + TIP_R * 1.2} ${cpY} ${w / 2 + TIP_R} ${tipY}`,
    // rounded tip (clockwise arc)
    `A ${TIP_R} ${TIP_R} 0 0 1 ${w / 2 - TIP_R} ${tipY}`,
    // left side of tip arc → left shoulder
    `C ${w / 2 - TIP_R * 1.2} ${cpY} ${w / 2 - spread} ${base} ${R} ${base}`,
    // bottom-left rounded corner → left wall
    `Q 0 ${base} 0 ${base - R}`,
    `Z`,
  ].join(' ');
}

type Phase = 'idle' | 'pulling' | 'releasing' | 'refreshing' | 'done';

interface Props {
  header: ReactNode;
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  color?: string;
  className?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function LiquidPullToRefresh({
  header,
  children,
  onRefresh,
  threshold = 90,
  maxPull = 160,
  color = 'var(--primary-accent)',
  className = '',
  onScroll,
  scrollRef: externalScrollRef,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalScrollRef || internalScrollRef;
  const spacerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const spinnerRef = useRef<SVGGElement>(null);

  const spring = useRef<SpringState>({ value: 0, velocity: 0 });
  const targetPull = useRef(0);
  const rafId = useRef<number | null>(null);
  const lastT = useRef<number | null>(null);
  const phaseRef = useRef<Phase>('idle');
  const spinAngle = useRef(0);

  const [phase, setPhase] = useState<Phase>('idle');
  const [dims, setDims] = useState({ w: 375, h: 0 });

  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const mouseStartY = useRef(0);
  const isMouseDragging = useRef(false);

  // Measure header
  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      const w = wrapRef.current?.offsetWidth ?? window.innerWidth;
      setDims({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // RAF animation loop
  const tick = useCallback((t: number) => {
    const dt = lastT.current ? Math.min((t - lastT.current) / 1000, 0.05) : 0.016;
    lastT.current = t;

    const cur = phaseRef.current;
    const next = springStep(spring.current, targetPull.current, dt);
    spring.current = next;

    const pull = Math.max(0, next.value);
    const { w, h } = dims;

    if (pathRef.current) {
      pathRef.current.setAttribute('d', buildDripPath(w, pull));
    }

    if (svgRef.current) {
      const svgTop = h - OVERLAP;
      const svgH = OVERLAP + pull + TIP_R + 4;
      svgRef.current.setAttribute('viewBox', `0 0 ${w} ${svgH}`);
      svgRef.current.setAttribute('width', `${w}`);
      svgRef.current.setAttribute('height', `${svgH}`);
      svgRef.current.style.width = `${w}px`;
      svgRef.current.style.height = `${svgH}px`;
      svgRef.current.style.top = `${svgTop}px`;
      // Update clipPath rect width
      const clipRect = svgRef.current.querySelector<SVGRectElement>('#lptr-clip rect');
      if (clipRect) clipRect.setAttribute('width', `${w}`);
    }

    // Push scroll content down so the drip is visible above it
    if (spacerRef.current) {
      spacerRef.current.style.height = `${pull}px`;
    }

    if (spinnerRef.current) {
      const isSpinning = cur === 'refreshing' || cur === 'done';
      if (isSpinning) spinAngle.current = (spinAngle.current + dt * 360) % 360;

      // Spinner center = center of the rounded tip circle
      const tipY = pull > 0.5 ? OVERLAP + pull - TIP_R : OVERLAP;
      const progress = Math.min(pull / threshold, 1);
      const opacity = cur === 'idle' ? 0 : Math.min(progress * 2.5, 1);

      spinnerRef.current.setAttribute(
        'transform',
        `translate(${w / 2}, ${tipY}) rotate(${spinAngle.current})`,
      );
      spinnerRef.current.style.opacity = String(opacity);

      const arc = spinnerRef.current.querySelector<SVGCircleElement>('.lptr-arc');
      if (arc) {
        const spR = 11.1;
        const circ = 2 * Math.PI * spR;
        arc.style.strokeDashoffset = isSpinning
          ? '0'
          : String(circ * (1 - progress * 0.85));
      }
    }

    const settled = Math.abs(next.value - targetPull.current) < 0.4 && Math.abs(next.velocity) < 0.4;
    if ((cur === 'releasing' || cur === 'done') && settled) {
      phaseRef.current = 'idle';
      setPhase('idle');
      rafId.current = null;
      lastT.current = null;
      return;
    }

    rafId.current = requestAnimationFrame(tick);
  }, [dims, threshold]);

  const startLoop = useCallback(() => {
    if (rafId.current) return;
    lastT.current = null;
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current); }, []);

  const applyPull = useCallback((dy: number) => {
    if (dy <= 0) { isDragging.current = false; return; }
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return;
    isDragging.current = true;
    const resistance = 1 - dy / (dy + maxPull * 1.5);
    const pull = Math.min(dy * resistance * 1.8, maxPull);
    targetPull.current = pull;
    spring.current = { value: pull, velocity: 0 };
    if (phaseRef.current !== 'pulling') { phaseRef.current = 'pulling'; setPhase('pulling'); }
    startLoop();
  }, [maxPull, startLoop]);

  const releasePull = useCallback(async () => {
    if (!isDragging.current && !isMouseDragging.current) return;
    isDragging.current = false;
    isMouseDragging.current = false;

    const pull = spring.current.value;
    if (pull >= threshold && phaseRef.current !== 'refreshing') {
      phaseRef.current = 'refreshing';
      setPhase('refreshing');
      targetPull.current = threshold * 0.6;
      startLoop();
      try { await onRefresh(); } finally {
        phaseRef.current = 'done';
        setPhase('done');
        targetPull.current = 0;
        startLoop();
      }
    } else {
      phaseRef.current = 'releasing';
      setPhase('releasing');
      targetPull.current = 0;
      startLoop();
    }
  }, [threshold, onRefresh, startLoop]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (phaseRef.current === 'refreshing') return;
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (phaseRef.current === 'refreshing') return;
    applyPull(e.touches[0].clientY - touchStartY.current);
  }, [applyPull]);

  const onTouchEnd = useCallback(() => { releasePull(); }, [releasePull]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (phaseRef.current === 'refreshing') return;
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return;
    mouseStartY.current = e.clientY;
    isMouseDragging.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isMouseDragging.current) return;
      applyPull(e.clientY - mouseStartY.current);
    };
    const onUp = () => { if (isMouseDragging.current) releasePull(); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [applyPull, releasePull]);

  const spR = 11.1;
  const spCirc = 2 * Math.PI * spR;
  const { w, h } = dims;

  // Suppress unused variable warning
  void phase;

  return (
    <div ref={wrapRef} className={`flex flex-col overflow-hidden ${className}`} style={{ position: 'relative' }}>

      {/*
        Layering (bottom → top):
          zIndex 10 — SVG drip (behind header, overlap rect hidden by header)
          zIndex 20 — Header (on top of SVG so it hides the overlap rectangle)
          scroll area has no z-index (flows below)
      */}

      {/* SVG drip — zIndex 10 (behind header). clipPath hides the overlap zone. */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: `${h - OVERLAP}px`,
          left: 0,
          width: `${w}px`,
          height: `${OVERLAP}px`,
          zIndex: 10,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
        width={w}
        height={OVERLAP}
        viewBox={`0 0 ${w} ${OVERLAP}`}
      >
        <defs>
          {/* Clip: only show pixels below the header bottom edge */}
          <clipPath id="lptr-clip">
            <rect x={0} y={OVERLAP} width={w} height={9999} />
          </clipPath>
        </defs>
        {/* Drip shape — clipped to below header bottom edge, no shadow filter */}
        <g clipPath="url(#lptr-clip)">
          <path
            ref={pathRef}
            d={buildDripPath(w, 0)}
            fill={color}
          />
        </g>
        <g
          ref={spinnerRef}
          transform={`translate(${w / 2}, ${OVERLAP})`}
          style={{ opacity: 0 }}
        >
          <circle cx={0} cy={0} r={spR} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2.8} />
          <circle
            className="lptr-arc"
            cx={0}
            cy={0}
            r={spR}
            fill="none"
            stroke="white"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeDasharray={spCirc}
            strokeDashoffset={spCirc}
            transform="rotate(-90)"
          />
        </g>
      </svg>

      {/* Header — zIndex 20, above SVG drip.
          drop-shadow follows the rounded shape (unlike box-shadow which is always a rectangle). */}
      <div
        className="flex-shrink-0"
        style={{
          position: 'relative',
          zIndex: 20,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))',
        }}
      >
        <div ref={headerRef}>
          {header}
        </div>
      </div>

      {/* Scroll area — push content down so the drip is visible above it */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ overscrollBehavior: 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onScroll={onScroll}
      >
        {/* Spacer that grows with pull distance, pushing content below the drip */}
        <div ref={spacerRef} style={{ height: 0, flexShrink: 0 }} />
        {children}
      </div>
    </div>
  );
}

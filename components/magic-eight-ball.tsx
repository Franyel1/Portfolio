'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import {
  createEightBallRenderer,
  smoothBallProgress,
  motionDirection,
  type BallPose,
} from '@/lib/eight-ball-renderer';

const answers = [
  'Yes, absolutely',
  'Definitely yes',
  'Without a doubt',
  'Yes, for sure',
  'You should',
  'A clear yes',
  'Most definitely',
  'Yes, happily',
  'Absolutely',
  'It is a yes',
  'Yes, hire me',
  'I am the one',
  'A great choice',
  'You can count on it',
  'Yes, I can',
  'The answer is yes',
  'Yes, without question',
  'I would be a great fit',
  'Yes, let us work together',
  'Hire me with confidence',
] as const;

const initialPose: BallPose = { yaw: -0.32, pitch: 0.14, roll: -0.08 };
const answeredPose: BallPose = {
  yaw: Math.PI - 0.18,
  pitch: -0.08,
  roll: 0.06,
};

function animateWhile(
  frame: { current: number },
  step: (now: number) => boolean,
) {
  function tick(now: number) {
    frame.current = step(now) ? requestAnimationFrame(tick) : 0;
  }
  frame.current = requestAnimationFrame(tick);
}

/** One interaction-driven controller for following, shaking, and settling. */
export default function MagicEightBall({ paused }: { paused: boolean }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const toy = useRef<HTMLButtonElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const renderer = useRef<ReturnType<typeof createEightBallRenderer>>(null);
  const frame = useRef(0);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pose = useRef({ ...initialPose });
  const settledPose = useRef({ ...initialPose });
  const targetPose = useRef({ ...initialPose });
  const offset = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const direction = useRef({ x: 1, y: 0 });
  const pending = useRef<string | null>(null);
  const lastAnswer = useRef<string | null>(null);
  const surfaceText = useRef<{ answer: string | null; reveal: number }>({
    answer: null,
    reveal: 1,
  });
  const reduced = useRef(false);
  const motionPaused = useRef(paused);
  const gesture = useRef({
    pointer: -1,
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
    base: { ...initialPose },
    travel: 0,
    moved: false,
  });

  const destination = useCallback((base: BallPose) => {
    const p =
      motionPaused.current || reduced.current ? { x: 0, y: 0 } : mouse.current;
    return {
      pose: {
        yaw: base.yaw + p.x * 0.48,
        pitch: base.pitch + p.y * 0.42,
        roll: base.roll - p.x * 0.08,
      },
      offset: { x: p.x * 14, y: p.y * 18 },
    };
  }, []);
  const draw = useCallback((text = lastAnswer.current, reveal = 1) => {
    surfaceText.current = { answer: text, reveal };
    renderer.current?.draw(pose.current, text, reveal);
    if (toy.current)
      toy.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
    if (shadow.current)
      shadow.current.style.transform = `translateX(${offset.current.x * 0.4}px) scale(${1 - Math.abs(offset.current.y) * 0.009})`;
  }, []);
  const returnToFront = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const fromPose = { ...pose.current };
    const fromOffset = { ...offset.current };
    const began = performance.now();
    animateWhile(frame, (now) => {
      const t = Math.min(1, (now - began) / 700);
      const progress = smoothBallProgress(t);
      pose.current = {
        yaw: fromPose.yaw + (initialPose.yaw - fromPose.yaw) * progress,
        pitch: fromPose.pitch + (initialPose.pitch - fromPose.pitch) * progress,
        roll: fromPose.roll + (initialPose.roll - fromPose.roll) * progress,
      };
      offset.current = {
        x: fromOffset.x * (1 - progress),
        y: fromOffset.y * (1 - progress),
      };
      draw();
      if (t >= 1) {
        settledPose.current = { ...initialPose };
        pose.current = { ...initialPose };
        offset.current = { x: 0, y: 0 };
        frame.current = 0;
        draw();
        return false;
      }
      return true;
    });
  }, [draw]);
  const finish = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (pending.current !== null) {
      settledPose.current = { ...targetPose.current };
      lastAnswer.current = pending.current;
      setAnswer(pending.current);
      pending.current = null;
      setShaking(false);
      if (returnTimer.current) clearTimeout(returnTimer.current);
      returnTimer.current = setTimeout(() => {
        returnTimer.current = null;
        returnToFront();
      }, 4000);
    }
    const to = destination(settledPose.current);
    pose.current = to.pose;
    offset.current = to.offset;
    gesture.current.pointer = -1;
    draw();
  }, [destination, draw, returnToFront]);

  const follow = useCallback(() => {
    if (
      frame.current ||
      pending.current !== null ||
      motionPaused.current ||
      reduced.current
    )
      return;
    let previous = performance.now();
    function advanceFollow(now: number) {
      const to = destination(settledPose.current);
      const ease = 1 - Math.exp(-Math.min(50, now - previous) / 65);
      previous = now;
      let difference = 0;
      for (const axis of ['yaw', 'pitch', 'roll'] as const) {
        const delta = to.pose[axis] - pose.current[axis];
        difference += Math.abs(delta);
        pose.current[axis] += delta * ease;
      }
      for (const axis of ['x', 'y'] as const) {
        const delta = to.offset[axis] - offset.current[axis];
        difference += Math.abs(delta) * 0.01;
        offset.current[axis] += delta * ease;
      }
      if (difference < 0.001) {
        pose.current = to.pose;
        offset.current = to.offset;
        frame.current = 0;
        draw();
        return false;
      } else {
        draw();
        return true;
      }
    }
    animateWhile(frame, advanceFollow);
  }, [destination, draw]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const scene = createEightBallRenderer(element);
    renderer.current = scene;
    const resize = new ResizeObserver(([entry]) => {
      const size = Math.min(
        640,
        Math.round(entry.contentRect.width * Math.min(devicePixelRatio, 1.5)),
      );
      if (!size) return;
      element.width = element.height = size;
      scene?.draw(
        pose.current,
        surfaceText.current.answer,
        surfaceText.current.reveal,
      );
      if (scene) toy.current?.setAttribute('data-rendered', 'true');
    });
    resize.observe(element);
    return () => {
      cancelAnimationFrame(frame.current);
      if (returnTimer.current) clearTimeout(returnTimer.current);
      resize.disconnect();
      renderer.current = null;
    };
  }, []);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduced.current = preference.matches;
      if (preference.matches) finish();
    };
    const visibility = () => {
      if (document.hidden) finish();
    };
    sync();
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame.current);
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [finish]);
  useEffect(() => {
    motionPaused.current = paused;
    if (paused) finish();
  }, [paused, finish]);

  useEffect(() => {
    const element = toy.current;
    if (!element) return;
    let visible = false,
      dirty = true,
      bounds: DOMRect | null = null;
    let previous: { x: number; y: number } | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
      if (!visible) {
        mouse.current = { x: 0, y: 0 };
        previous = null;
        finish();
      }
    });
    observer.observe(element);
    const invalidate = () => {
      dirty = true;
    };
    const track = (event: globalThis.PointerEvent) => {
      if (
        !visible ||
        event.pointerType !== 'mouse' ||
        motionPaused.current ||
        reduced.current ||
        document.hidden
      )
        return;
      if (gesture.current.pointer !== -1) return;
      if (dirty || !bounds) {
        bounds = element.parentElement!.getBoundingClientRect();
        dirty = false;
      }
      if (previous)
        direction.current = motionDirection(
          event.clientX - previous.x,
          event.clientY - previous.y,
          direction.current,
        );
      previous = { x: event.clientX, y: event.clientY };
      mouse.current = {
        x: Math.max(
          -1,
          Math.min(
            1,
            (event.clientX - bounds.x - bounds.width / 2) /
              (bounds.width * 0.8),
          ),
        ),
        y: Math.max(
          -1,
          Math.min(
            1,
            (event.clientY - bounds.y - bounds.height / 2) /
              (bounds.height * 0.8),
          ),
        ),
      };
      if (pending.current === null) follow();
    };
    const leave = () => {
      previous = null;
      mouse.current = { x: 0, y: 0 };
      follow();
    };
    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', track);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [finish, follow]);

  const shake = () => {
    if (pending.current !== null) return;
    if (returnTimer.current) {
      clearTimeout(returnTimer.current);
      returnTimer.current = null;
    }
    const choices = answers.filter((value) => value !== lastAnswer.current);
    pending.current = choices[Math.floor(Math.random() * choices.length)];
    const from = { ...pose.current },
      fromOffset = { ...offset.current };
    targetPose.current = {
      ...answeredPose,
      yaw:
        (Math.floor(from.yaw / (2 * Math.PI)) + 1) * 2 * Math.PI +
        answeredPose.yaw,
    };
    if (motionPaused.current || reduced.current) {
      finish();
      return;
    }
    setShaking(true);
    cancelAnimationFrame(frame.current);
    const began = performance.now();
    let lastDraw = 0;
    const axis = { ...direction.current };
    const animate = (now: number) => {
      const t = Math.min(1, (now - began) / 1600);
      if (t === 1) {
        finish();
        return;
      }
      if (now - lastDraw >= 1000 / 30) {
        const p = smoothBallProgress(t),
          to = destination(targetPose.current);
        // The impulse stays in the pointer's direction, tapering to zero velocity.
        axis.x += (direction.current.x - axis.x) * 0.16;
        axis.y += (direction.current.y - axis.y) * 0.16;
        const impulse =
          Math.sin(t * 36) * Math.sin(Math.PI * t) * (1 - t) * (1 - t);
        pose.current = {
          yaw: from.yaw + (to.pose.yaw - from.yaw) * p + axis.x * impulse * 0.5,
          pitch:
            from.pitch +
            (to.pose.pitch - from.pitch) * p +
            axis.y * impulse * 0.5,
          roll:
            from.roll +
            (to.pose.roll - from.roll) * p -
            axis.x * impulse * 0.15,
        };
        offset.current = {
          x:
            fromOffset.x +
            (to.offset.x - fromOffset.x) * p +
            axis.x * impulse * 38,
          y:
            fromOffset.y +
            (to.offset.y - fromOffset.y) * p +
            axis.y * impulse * 38,
        };
        const oldFace = t < 0.45;
        const reveal = oldFace
          ? 1 - smoothBallProgress(Math.min(1, t / 0.25))
          : smoothBallProgress(Math.max(0, Math.min(1, (t - 0.66) / 0.22)));
        draw(oldFace ? lastAnswer.current : pending.current, reveal);
        lastDraw = now;
      }
      frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
  };
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0 || pending.current !== null)
      return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    gesture.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      originX: event.clientX,
      originY: event.clientY,
      base: { ...pose.current },
      travel: 0,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = gesture.current;
    if (drag.pointer !== event.pointerId) return;
    const dx = event.clientX - drag.x,
      dy = event.clientY - drag.y;
    direction.current = motionDirection(dx, dy, direction.current);
    drag.travel += Math.hypot(dx, dy);
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.moved = drag.travel > 12;
    if (!motionPaused.current && !reduced.current) {
      const x = Math.max(-100, Math.min(100, event.clientX - drag.originX));
      const y = Math.max(-100, Math.min(100, event.clientY - drag.originY));
      pose.current = {
        ...drag.base,
        yaw: drag.base.yaw + x * 0.009,
        pitch: drag.base.pitch + y * 0.009,
      };
      offset.current = { x: x * 0.14, y: y * 0.14 };
      if (!frame.current)
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          draw();
        });
    }
    if (drag.travel >= 120) {
      drag.pointer = -1;
      shake();
    }
  };
  const returnFromDrag = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    gesture.current.pointer = -1;
    if (motionPaused.current || reduced.current) finish();
    else follow();
  };
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = gesture.current;
    if (drag.pointer === event.pointerId && drag.travel >= 60) {
      drag.pointer = -1;
      shake();
    } else if (drag.pointer === event.pointerId) returnFromDrag();
    drag.pointer = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div
      className="eight-ball"
      data-shaking={shaking}
      data-answered={answer !== null}
      data-paused={paused}
    >
      <div className="eight-ball-stage">
        <div ref={shadow} className="eight-ball-shadow" aria-hidden="true" />
        <button
          ref={toy}
          type="button"
          className="eight-ball-toy"
          aria-label="Should you hire me? Shake the Magic 8 Ball to find out"
          aria-disabled={shaking}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={release}
          onPointerCancel={(event) => {
            if (pending.current === null) returnFromDrag();
            gesture.current.pointer = -1;
            gesture.current.moved = false;
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onClick={(event) => {
            if (event.detail === 0 || !gesture.current.moved) shake();
          }}
        >
          <span className="eight-ball-shell" aria-hidden="true" />
          <span className="eight-ball-fallback" aria-hidden="true">
            8
          </span>
          <canvas
            ref={canvas}
            className="eight-ball-sphere"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

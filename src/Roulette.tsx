import { For, createMemo, createSignal, onMount, onCleanup, type JSX } from "solid-js";
import { type Entry } from "./Setting.tsx";
import style from "./Roulette.module.css";

type RouletteState = { type: "stopping" }
  | { type: "accelerating", start: number }
  | { type: "rotating", offset: number }
  | { type: "slowingdown", stop: number, offset: number, label: string };

export default (props: { entries: Entry[], onDecision?: (label: string) => unknown }) => {
  const pieces = createMemo(() => {
    const entries = props.entries;
    const population = entries.reduce((l, { count }) => l + count, 0);
    let left = 0;
    const pieces: JSX.Element[] = [];
    const texts: JSX.Element[] = [];
    for (let i = 0; i < entries.length; ++i) {
      const { label, count } = entries[i];
      if (count === 0) continue;
      const ld = left / population * 2 * Math.PI;
      const rd = (left + count) / population * 2 * Math.PI;
      const md = (ld + rd) / 2;
      let path;
      if (count !== population) {
        path = "M0 0";
        if (i === 0) path += "L-0.5 -0.5";
        path += `L${Math.sin(ld)} ${0 - Math.cos(ld)}`;
        path += `A1 1,0,${count > entries.length / 2 ? 1 : 0} 1,${Math.sin(rd)} ${0 - Math.cos(rd)}`;
        if (i !== entries.length - 1) {
          const kd = (2 * rd + 2 * Math.PI) / 3;
          path += `L${Math.sin(kd) / 2} ${0 - Math.cos(kd) / 2}`;
        }
        path += "Z";
      } else {
        path = "M0 1A1 1,0,1 1,0 -1A1 1,0,1 1,0 1";
      }
      pieces.push(<path fill={`hsl(${i / entries.length}turn 100% 50%)`} d={path} />);
      texts.push(<text x="0" y="-0.65" transform={`rotate(${md / Math.PI * 180})`} stroke="#000" stroke-width="0.04" font-family="monospace" font-size="0.3" font-weight="bold" text-anchor="middle">{label}</text>);
      texts.push(<text x="0" y="-0.65" transform={`rotate(${md / Math.PI * 180})`} fill="#fff" font-family="monospace" font-size="0.3" font-weight="bold" text-anchor="middle">{label}</text>);
      left += count;
    }
    return pieces.concat(texts);
  });

  const [rot, setRot] = createSignal(0);
  let onclick: () => unknown;

  onMount(() => {
    let state: RouletteState;
    let last: number;
    let reqId: number | null = null;
    requestAnimationFrame((timestamp) => {
      last = timestamp;
      state = { type: "accelerating", start: timestamp + 500 };
      reqId = requestAnimationFrame(animation);
    });
    const animation = (timestamp: number) => {
      last = timestamp;
      if (state.type === "accelerating") {
        const t = timestamp - state.start;
        if (t >= 3000) state = { type: "rotating", offset: state.start + 1500 };
        else if (t >= 0) setRot(t ** 2 / 6000);
        else setRot(0);
      }
      if (state.type === "rotating") {
        setRot(timestamp - state.offset);
      }
      if (state.type === "slowingdown") {
        const t = state.stop - timestamp;
        if (t >= 10000) setRot(5000 - t + state.offset);
        else if (t >= 0) setRot(t ** 2 / -20000 + state.offset);
        else {
          setRot(state.offset);
          reqId = null;
          props.onDecision?.(state.label);
          return;
        }

      }
      reqId = requestAnimationFrame(animation);
    }
    onclick = () => {
      if (state.type !== "rotating") return;
      const [offset, label] = (() => {
        const entries = props.entries;
        const population = entries.reduce((c, { count }) => c + count, 0);
        const rnd = Math.floor(Math.random() * population);
        let c = 0;
        let i = 0;
        for (; i < entries.length; ++i) {
          c += entries[i].count;
          if (rnd < c) break;
        }
        const { count } = entries[i];
        let dir: number;
        if (count / population * 360 < 10) {
          dir = (c - count / 2) / population * 360;
        } else if (Math.random() < 0.5) {
          dir = ((c - count) / population) * 360 + 5;
        } else {
          dir = (c / population) * 360 - 5;
        }
        return [360 - dir, entries[i].label];
      })();
      const nowRot = rot();
      const ad = ((offset - (nowRot + 5000)) % 360 + 360) % 360;
      state = { type: "slowingdown", stop: last + ad + 10000, offset, label };
    };
    onCleanup(() => {
      if (reqId !== null) cancelAnimationFrame(reqId);
    });
  });

  return (<div class={style.roulette}>
    <svg viewBox="-1 -1 2 2" onClick={() => onclick?.()}>
      <g transform={`rotate(${rot()})`}>
        <For each={pieces()}>{elem => elem}</For>
      </g>
      <path d="M0.05 0L-0.05 0L0 -0.5Z" fill="yellow" stroke="#000" stroke-width="0.01" />
      <circle r="0.1" fill="yellow" stroke="#000" stroke-width="0.01" />
    </svg>
  </div>);
};

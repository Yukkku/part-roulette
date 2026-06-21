import { createSignal, createEffect, For } from "solid-js";
import style from "./Setting.module.css";

export type Entry = { label: string, count: number };
const maxCount = 10;

export default (props: { onSubmit?: (entries: Entry[]) => unknown }) => {
  const [config, setConfig] = createSignal<Entry[]>([
    { label: "1st", count: 2 },
    { label: "2nd", count: 1 },
    { label: "3rd", count: 1 },
  ]);
  createEffect(() => console.log(config()));
  const onChangeLabel = (index: number, newLabel: string) => setConfig(v => {
    return v.with(index, {
      label: newLabel || v[index].label,
      count: v[index].count
    });
  });
  const onChangeCount = (index: number, newCount: string | number) => setConfig(v => {
    let count: number;
    if (typeof newCount === 'string') {
      count = Number(newCount);
    } else {
      count = newCount;
    }
    if (Number.isNaN(count)) count = v[index].count;
    count = Math.round(count);
    count = Math.max(0, Math.min(maxCount, count));
    return v.with(index, { label: v[index].label, count });
  });
  const addEntry = () => setConfig(v => {
    let partnum = 1;
    const partName = () => {
      if (partnum === 1) return "1st";
      if (partnum === 2) return "2nd";
      if (partnum === 3) return "3rd";
      return `${partnum}th`;
    };
    while (v.find(({ label }) => label === partName())) partnum += 1;
    return [...v, { label: partName(), count: 1 }];
  });
  const removeEntry = (index: number) => setConfig(v => v.toSpliced(index, 1));
  return (<div class={style.setting}>
    <For each={config()}>{({ label, count }, index) => (<div class={style.entry} style={{ "--color-index": index() / config().length }}>
      <div class={style.delete} onClick={() => removeEntry(index())} />
      <input class={style.label} value={label} onChange={e => onChangeLabel(index(), e.target.value)} />
      <div classList={{ [style.decr]: true, [style.disable]: count === 0 }}
        onClick={() => onChangeCount(index(), count - 1)} />
      <input class={style.count} value={count} onChange={e => onChangeCount(index(), e.target.value)} />
      <div classList={{ [style.incr]: true, [style.disable]: count === maxCount }}
        onClick={() => onChangeCount(index(), count + 1)} />
    </div>)
    }</For >
    <div class={style.add} onClick={addEntry} />
    <div class={style.done} onClick={() => props.onSubmit?.(config())}>ROLL!</div>
  </div >);
};

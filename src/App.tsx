import { createSignal, Show } from "solid-js";
import "./App.module.css";
import Setting, { type Entry } from "./Setting.tsx";
import Roulette from "./Roulette.tsx";
import Result from "./Result.tsx";

export default () => {
  const [entries, setEntries] = createSignal<Entry[] | null>(null);
  const [result, setResults] = createSignal<string | null>(null);

  return <>
    <h1 style={{ "text-align": "center" }}>パート割りルーレット</h1>
    <Show when={entries() === null}><Setting onSubmit={entries => setEntries(entries)} /></Show>
    <Show when={entries() !== null}><Roulette entries={entries()!} onDecision={label => setResults(label)} /></Show>
    <Show when={result() !== null}><Result text={result()!} /></Show>
  </>;
};

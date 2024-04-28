import { Accessor, createMemo, createSignal } from 'solid-js'

export interface PathObj {
  back: () => void,
  forward: () => void,
  clear: () => void,
  canGoBack: () => boolean,
  canGoForward: () => boolean,
}

export function createHistory<T>(initialValue: T): [Accessor<T>, (value: T) => void, PathObj] {
  const [signal, setSignal] = createSignal<T>(initialValue);
  const [index, setIndex] = createSignal(0);
  const arr: T[] = [initialValue]

  function setValue(value: T) {
    const indexCur = index();
    if (value !== arr[indexCur]) {
      setSignal(value);
      if (indexCur < arr.length - 1) {
        arr.splice(indexCur + 1)
      }
      arr.push(value);
      setIndex(indexCur + 1)
    }
  }

  function back() {
    const indexCur = index();
    if (indexCur > 0) {
      const value = arr.at(indexCur - 1)!;
      setSignal(value);
      setIndex(indexCur - 1)
    }
  }

  function forward() {
    const indexCur = index();
    if (arr.length - 1 > indexCur) {
      setIndex(indexCur + 1)
      const value = arr.at(indexCur + 1)!;
      setSignal(value);
    }
  }

  function clear() {
    arr.splice(0)
    setIndex(-1)
  }

  const canGoBack = createMemo(() => index() > 0)
  const canGoForward = createMemo(() => index() < arr.length - 1)

  return [signal, setValue, {
    back, forward, clear
    , canGoBack, canGoForward
  }]
}

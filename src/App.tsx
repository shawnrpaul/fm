import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { createHistory } from "solid-signals";
import { Entry } from "./types";

const userDirsList = [
  "Home",
  "Documents",
  "Downloads",
  "Music",
  "Pictures",
  "Videos",
]

function App() {
  const [path, setPath] = createHistory("");
  const [userDirs, setUserDirs] = createSignal<{ [key: string]: string }>();
  const [items, setItems] = createSignal<Entry[]>([]);

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    console.log(userDirs())
    setPath.history([dirs[0].path])
  })

  createEffect(async () => {
    if (path() !== "") {
      const items: any[] = await invoke("get_dir_content", { path: path() })
      setItems(items)
    }
  })

  return (
    <div class="container">
      <div class='header'>
        <button disabled={path.history().length === 0} onClick={() => setPath.history.back()}>
          {/* <ArrowLeft size={24} /> */}
          Back
        </button>
        <button disabled={path.history().length === 0} onClick={() => setPath.history.forward()}>
          {/* <ArrowRight size={24} /> */}
          Forward
        </button>
        <form onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.target as HTMLFormElement)
          setPath(data.get('path') as string)
        }}>
          <input name='path' value={path()} type='text' />
        </form>

      </div>
      <section>
        <ul class="user-dirs">
          <For each={userDirsList} >
            {(item) => <li onClick={() => setPath(userDirs()![item])}>
              {item}
            </li>}
          </For>
        </ul>
      </section>
      <Show when={items().length > 0}>
        <ul class='items'>
          <For each={items()} >
            {(item) => <li onClick={() => item.is_dir && setPath(item.path)}>
              {item.name}
            </li>}
          </For>
        </ul>
      </Show>
    </div >
  );
}

export default App

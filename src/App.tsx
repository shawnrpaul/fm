import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { createHistory } from "solid-signals";
import { Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";


function App() {
  const [path, setPath] = createHistory("", {
    equals: (prev, next)=> prev === next
  });
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
        <button prop:disabled={path.history().length === 1} onClick={() => setPath.history.back()}>
          {/* <ArrowLeft size={24} /> */}
          Back
        </button>
        <button onClick={() => setPath.history.forward()}>
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
    <UserDirs setPath={setPath} userDirs={userDirs} />
    <ListView items={items} setPath={setPath}  />
    </div >
  );
}

export default App

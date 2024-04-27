import { createSignal, onMount, createResource } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { createHistory } from "./createHistory";
import { Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";


function App() {
  const [path, setPath, pathObj] = createHistory<string | undefined>(undefined);
  const [userDirs, setUserDirs] = createSignal<{ [key: string]: string }>();
  // const [items, setItems] = createSignal<Entry[]>([]);
  const [items] = createResource(path, (path) => {
    if (path !== "") {
      return invoke("get_dir_content", { path })
    }
    return []
  })

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    console.log(userDirs())
    pathObj.clear();
    setPath(userDirs()!["Home"]!)
  })

  return (
    <div class="container">
      <div class='header'>
        <button prop:disabled={!pathObj.canGoBack()} onClick={() => pathObj.back()}>
          {/* <ArrowLeft size={24} /> */}
          Back
        </button>
        <button prop:disabled={!pathObj.canGoForward()} onClick={() => pathObj.forward()}>
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
      <ListView items={items} setPath={setPath} />
    </div >
  );
}

export default App

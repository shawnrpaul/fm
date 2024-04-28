import { createSignal, onMount, createResource, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { createHistory } from "./createHistory";
import { Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";
import { ArrowLeft, ArrowRight } from "lucide-solid";


function App() {
  const [path, setPath, pathObj] = createHistory<string>("");
  const [userDirs, setUserDirs] = createSignal<Record<string, string>>({});
  const [items] = createResource(path, (path) => {
    if (path !== "") {
      return invoke("get_dir_content", { path }) as unknown as Entry[]
    }
    return []
  })

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    pathObj.clear();
    setPath(userDirs()!["Home"]!)
  })

  return (
    <div class="container">
      <div class='header'>
        <button prop:disabled={!pathObj.canGoBack()} onClick={() => pathObj.back()}>
          <ArrowLeft size={24} />
        </button>
        <button prop:disabled={!pathObj.canGoForward()} onClick={() => pathObj.forward()}>
          <ArrowRight size={24} />
        </button>
        <form onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.target as HTMLFormElement)
          setPath(data.get('path') as string)
        }}>
          <input name='path' value={path()} type='text' />
        </form>
      </div>

      <Show when={Object.hasOwn(userDirs(), "Home")} >
        <UserDirs path={path} setPath={setPath} userDirs={userDirs} />
      </Show  >
      <ListView items={items} setPath={setPath} />
    </div >
  );
}

export default App

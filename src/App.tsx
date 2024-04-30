import { createSignal, onMount, createResource, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { createHistory } from "./createHistory";
import { AppSettings, Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";
import { createStore } from "solid-js/store";
import Header from "./Header";


function App() {
  const [path, setPath, pathObj] = createHistory<string>("");
  const [userDirs, setUserDirs] = createSignal<Record<string, string>>({});
  const [items] = createResource(path, (path) => {
    if (path !== "") {
      return invoke("get_dir_content", { path }) as unknown as Entry[]
    }
    return []
  })
  const [settings, setSettings] = createStore<AppSettings>({
    showHidden: false,
    theme: "default"
  })

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    pathObj.clear();
    setPath(userDirs()!["Home"]!)
  })

  return (
    <div class="container">
      <Header path={path} setPath={setPath} pathObj={pathObj} settings={settings} setSettings={setSettings}/>
      <Show when={Object.hasOwn(userDirs(), "Home")} >
        <UserDirs path={path} setPath={setPath} userDirs={userDirs} />
      </Show  >
      <ListView items={items} settings={settings} setPath={setPath} />
    </div >
  );
}

export default App

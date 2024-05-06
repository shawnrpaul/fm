import { createSignal, onMount, createResource, Show, createEffect } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { getMatches } from "@tauri-apps/api/cli";
import { createHistory } from "./createHistory";
import { AppSettings, Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";
import { createStore } from "solid-js/store";
import Header from "./Header";


function App() {
  const [path, setPath, pathObj] = createHistory<string>("");
  const [userDirs, setUserDirs] = createSignal<Record<string, string>>({});
  const [itemsResource] = createResource(path, (path) => {
    if (path !== "") {
      return invoke("get_dir_content", { path }) as unknown as Entry[]
    }
    return []
  })

  const [settings, setSettings] = createStore<AppSettings>({
    showHidden: false,
    theme: "default"
  })

  const collator = new Intl.Collator('en');
  const [list, setList] = createStore<Entry[]>([])
  const [selectedIndex, setSelectedIndex] = createSignal<number | undefined>();

  createEffect(() => {
    if (itemsResource.loading === true) {
      return
    }
    setList(itemsResource()!
      .filter(a => !a.name.startsWith('.') || settings.showHidden)
      .sort((a, b) => collator.compare(a.name, b.name)));
  })

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    pathObj.clear();

    let matches = await getMatches();
    let path = null;
    if ("path" in matches.args) {
      path = matches.args.path.value;
    }

    if (!path) {
      setPath(userDirs()!["Home"]!)
    } else {
      setPath(path)
    }

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        if (e.key === 'h') {
          setSettings('showHidden', (a) => !a)
        } else if (e.key === 'ArrowLeft') {
          pathObj.back()
        } else if (e.key === 'ArrowRight') {
          pathObj.forward()
        }
      }
      else if (e.key === 'ArrowUp') {
        const curIndex = selectedIndex()
        if (curIndex !== undefined && curIndex > 0) {
          setSelectedIndex(curIndex - 1)
        }
      } else if (e.key === 'ArrowDown') {
        const curIndex = selectedIndex()
        if (curIndex === undefined) {
          setSelectedIndex(0)
        } else if (curIndex < list.length - 1) {
          setSelectedIndex(curIndex + 1)
        }
      } else if (e.key === "Enter") {
        const curIndex = selectedIndex()
        if (curIndex !== undefined) {
          const item = list.at(curIndex)!
          if (item.is_dir) { setPath(item.path); }
          else invoke("open_file", { path: item.path })
        }
      }
    })
  })


  return (
    <div class="container">
      <Header path={path} setPath={setPath} pathObj={pathObj} settings={settings} setSettings={setSettings} />
      <Show when={Object.hasOwn(userDirs(), "Home")} >
        <UserDirs path={path} setPath={setPath} userDirs={userDirs} />
      </Show  >
      <Show when={!itemsResource.loading}>
        <ListView list={list} setList={setList} settings={settings} setPath={setPath} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </Show>
    </div >
  );
}

export default App

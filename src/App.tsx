import { createSignal, onMount, createResource, Show, createEffect, createSelector } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { getMatches } from "@tauri-apps/api/cli";
import { createHistory } from "./createHistory";
import { AppSettings, Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";
import { createStore, produce } from "solid-js/store";
import Header from "./components/Header";
import DialogProvider from "./components/DialogProvider";
import ContextMenuProvider from "./components/ContextMenuProvider";


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
  const selected = createSelector(selectedIndex)
  const [openDialog, setOpenDialog] = createSignal(false);

  createEffect(() => {
    if (itemsResource.loading === true) {
      return
    }
    setList(itemsResource()!
      .filter(a => !a.is_hidden || settings.showHidden)
      .sort((a, b) => collator.compare(a.name, b.name)));
  })

  onMount(async () => {
    const dirs: Entry[] = await invoke("get_user_dirs")
    setUserDirs(Object.fromEntries(dirs.map(a => [a.name, a.path])))
    pathObj.clear();

    let matches = await getMatches();
    if ("path" in matches.args) {
      let path = matches.args.path.value as string;
      if (!path) {
        setPath(userDirs()!["Home"]!)
      } else {
        setPath(path)
      }
    }

    document.addEventListener('keydown', (e) => {
      if (openDialog()) return;
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
      }
      else if (e.key === "Enter") {
        const curIndex = selectedIndex()
        if (curIndex !== undefined) {
          const item = list.at(curIndex)!
          if (item.is_dir) { setPath(item.path); }
          else invoke("open_file", { path: item.path })
        }
      }
    })
  })

  const selectOrOpen = (entry: Entry, index: number) => {
    if (selected(index)) {
      if (entry.is_dir) { setPath(entry.path); }
      else invoke("open_file", { path: entry.path })
    } else {
      setSelectedIndex(index)
    }
  }

  const deleteSelected = () => {
    const index = selectedIndex();
    if (index !== undefined) {
      invoke("remove_path", { path: list.at(index)?.path })
        .then(() => setList((e) => e.filter((_, i) => index !== i)));
    }
  }

  const renameSelected = (newName: string) => {
    const index = selectedIndex();
    if (index !== undefined) {
      invoke("rename_path", { path: list.at(index)?.path, name: newName })
        .then(() => setList(index, produce((e) => {
          e.name = newName.split('/').at(-1)!;
          e.path = newName
        })));
    }
  }
  return (
    <div class="container" oncapture:contextmenu={(e) => {
      const a = e.target.closest('li')?.dataset.index
      if (a) {
        setSelectedIndex(+a);
      } else {
        setSelectedIndex(undefined)
      }
    }}>
      <Header path={path} setPath={setPath} pathObj={pathObj} settings={settings} setSettings={setSettings} />
      <Show when={Object.hasOwn(userDirs(), "Home")} >
        <UserDirs path={path} setPath={setPath} userDirs={userDirs} />
      </Show  >
      <Show when={!itemsResource.loading}>
        <DialogProvider
          list={list}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          renameSelected={renameSelected}
          selectedIndex={selectedIndex}
          deleteSelected={deleteSelected}
        >
          <ContextMenuProvider
            setOpenDialog={setOpenDialog}
            deleteSelected={deleteSelected}>
            <ListView
              list={list}
              setList={setList}
              selected={selected}
              selectOrOpen={selectOrOpen}
            />
          </ContextMenuProvider>
        </DialogProvider>
      </Show>
    </div >
  );
}

export default App

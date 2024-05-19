import { createSignal, onMount, createResource, Show, createEffect, createSelector } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { getMatches } from "@tauri-apps/api/cli";
import { createHistory } from "./createHistory";
import { AppSettings, Entry } from "./types";
import UserDirs from "./UserDirs";
import ListView from "./ListView";
import { createStore } from "solid-js/store";
import Header from "./components/Header";
import DialogProvider from "./components/DialogProvider";
import ContextMenuProvider from "./components/ContextMenuProvider";


function App() {
  const [path, setPath, pathObj] = createHistory<string>("");
  const [userDirs, setUserDirs] = createSignal<Record<string, string>>({});
  const [entryListResource, { mutate: mutateEntryListResource, refetch: refetchEntryListResource }] = createResource(path, (path) => {
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
  const [entryList, setEntryList] = createStore<Entry[]>([])
  const [selectedIndex, setSelectedIndex] = createSignal<number | undefined>();
  const selected = createSelector(selectedIndex)
  const [openDialog, setOpenDialog] = createSignal(false);

  createEffect(() => {
    if (entryListResource.loading === true) {
      return
    }
    setEntryList(entryListResource()!
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
      const key = e.key.toLowerCase();
      if (e.ctrlKey) {
        if (key === 'h') {
          setSettings('showHidden', (a) => !a);
          return;
        }
        if (key === 'r') {
          refetchEntryListResource();
          return;
        }
      }

      if (e.altKey) {
        if (key === 'arrowleft') {
          pathObj.back();
          return;
        } else if (key === 'arrowright') {
          pathObj.forward();
          return;
        }
      }

      else if (key === 'arrowup') {
        const curIndex = selectedIndex()
        if (curIndex !== undefined && curIndex > 0) {
          setSelectedIndex(curIndex - 1)
        }
      } else if (key === 'arrowdown') {
        const curIndex = selectedIndex()
        if (curIndex === undefined) {
          setSelectedIndex(0)
        } else if (curIndex < entryList.length - 1) {
          setSelectedIndex(curIndex + 1)
        }
      }
      if (key === "enter") {
        const curIndex = selectedIndex()
        if (curIndex !== undefined) {
          const item = entryList.at(curIndex)!
          if (item.is_dir) { setPath(item.path); }
          else invoke("open_file", { path: item.path })
        }
      } else if (key === "f2") {
        const curIndex = selectedIndex()
        if (curIndex !== undefined) {
          setOpenDialog(true)
        }
      } else if (key === "delete") {
        deleteSelected()
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
    const index = selectedIndex()!
    if (index !== undefined) {
      const path = entryList.at(index)?.path
      invoke("remove_path", { path })
        .then(() => {
          return mutateEntryListResource(a => (a as Entry[]).filter((entry) => entry.path !== path));
        })
    }
  }

  const renameSelected = (newName: string) => {
    const index = selectedIndex();
    if (index !== undefined) {
      const entry = entryList.at(index)!
      const path = entry.path;
      invoke("rename_path", { path, name: newName })
        .then(() => {
          mutateEntryListResource((a) => {
            const index = a!.findIndex(a => a.path === path);
            const newPath = path.substring(0, path.indexOf(entry.name)) + newName;
            const newObj = { ...entry, path: newPath, name: newName }
            return a!.with(index, newObj);
          })
        })
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
      <Show when={!entryListResource.loading}>
        <DialogProvider
          list={entryList}
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
              list={entryList}
              setList={setEntryList}
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

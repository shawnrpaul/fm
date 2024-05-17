import { ContextMenu } from "@kobalte/core/context-menu";
import { Accessor, For, Setter } from "solid-js";
import { Entry } from "./types";
import { Folder, File, FileImage, FileAudio2, FileVideo } from "lucide-solid";
import { invoke } from "@tauri-apps/api";
import { SetStoreFunction } from "solid-js/store";

interface Props {
  list: Entry[];
  setList: SetStoreFunction<Entry[]>
  settings: { showHidden: boolean }
  setPath: (arg0: string) => void;
  selectedIndex: Accessor<number | undefined>
  setSelectedIndex: Setter<number | undefined>
  selected: (key: number | undefined) => boolean
  deleteSelected: () => void
}

export default function ListView(props: Props) {
  const getIcon = (item: Entry) => {
    if (item.is_dir) return <Folder />
    else if (item.mime_type.startsWith('image')) return <FileImage />
    else if (item.mime_type.startsWith('audio')) return <FileAudio2 />
    else if (item.mime_type.startsWith("video")) return <FileVideo />
    return <File />
  }

  return <ContextMenu>
    <ContextMenu.Trigger class="context-menu__trigger">
      <section class='list-view'>
        <ul class='list-view-list'>
          <For each={props.list} >
            {(item, index) => <li data-index={index()} classList={{ selected: props.selected(index()) }} tabindex='0' onClick={() => {
              if (props.selected(index())) {
                if (item.is_dir) { props.setPath(item.path); }
                else invoke("open_file", { path: item.path })
              } else {
                props.setSelectedIndex(index())
              }
            }}>
              {getIcon(item)}
              <span>{item.name}</span>
            </li>}
          </For>
        </ul>
      </section>
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Content class="context-menu__content">
        <ContextMenu.Item class="context-menu__item" onSelect={props.deleteSelected}>
          Delete <div class="context-menu__item-right-slot">delete</div>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu>;
}

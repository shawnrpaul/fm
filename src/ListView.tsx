import { For, Resource, Show } from "solid-js";
import { Entry } from "./types";
import { Folder, File, FileImage, FileAudio2, FileVideo } from "lucide-solid";
import { invoke } from "@tauri-apps/api";

interface Props {
  items: Resource<Entry[]>;
  setPath: (arg0: string) => void;
}

export default function ListView(props: Props) {
  const getIcon = (item: Entry) => {
    if (item.is_dir) return <Folder />
    else if (item.mime_type.startsWith('image')) return <FileImage />
    else if (item.mime_type.startsWith('audio')) return <FileAudio2 />
    else if (item.mime_type.startsWith("video")) return <FileVideo />
    return <File />
  }
  return <section class='list-view'>
    <Show when={!props.items.loading}>
      <ul class='list-view-list'>
        <For each={props.items()} >
          {(item) => <li onClick={() => {
            if (item.is_dir) { props.setPath(item.path); }
            else invoke("open_file", { path: item.path })
          }}>
            {getIcon(item)}
            <span>{item.name}</span>
          </li>}
        </For>
      </ul>
    </Show>
  </section>
}

import { For, Resource, Show } from "solid-js";
import { Entry } from "./types";
import { Folder, File } from "lucide-solid";

export default function ListView(props: { items: Resource<Entry[]>; setPath: (arg0: string) => void; }) {
  return <section class='list-view'>
    <Show when={!props.items.loading}>
      <ul class='list-view-list'>
        <For each={props.items()} >
          {(item) => <li onClick={() => item.is_dir && props.setPath(item.path)}>
            {item.is_dir ? <Folder /> :
              <File />}
            <span>{item.name}</span>
          </li>}
        </For>
      </ul>
    </Show>
  </section>
}

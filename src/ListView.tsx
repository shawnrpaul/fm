import { For, Show } from "solid-js";

export default function ListView(props) {
  return <section class='list-view'>
    <Show when={props.items().length > 0}>
      <ul class='items'>
        <For each={props.items()} >
          {(item) => <li onClick={() => item.is_dir && props.setPath(item.path)}>
            {item.name}
          </li>}
        </For>
      </ul>
    </Show>
  </section>
}

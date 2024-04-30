import { Home, File, Download, Music, Image, Video } from "lucide-solid"
import { Accessor, For, JSXElement, createSelector } from "solid-js"

interface Props {
  path: Accessor<string>;
  userDirs: Accessor<Record<string, string>>;
  setPath: (arg0: any) => void;
}

export default function UserDirs(props: Props) {
  const isSelected = createSelector(props.path);
  const userDirsList: [string, JSXElement][] = [
    ["Home", <Home />],
    ["Documents", <File />],
    ["Downloads", <Download />],
    ["Music", <Music />],
    ["Pictures", <Image />],
    ["Videos", <Video />],
  ]

  return <section>
    <ul class="user-dirs">
      <For each={userDirsList} >
        {([name, icon]) => {
          const path = props.userDirs()![name];
          return <li classList={{ selected: isSelected(path) }} onClick={() => {
            return props.setPath(path);
          }}>
            {icon} {name}
          </li>;
        }}
      </For>
    </ul>
  </section>

}

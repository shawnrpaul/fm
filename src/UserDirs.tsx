import { Home, File, Download, Music, Image, Video } from "lucide-solid"
import { Accessor, For, JSXElement, Show, createSelector } from "solid-js"

export default function UserDirs(props: { path: Accessor<string>; userDirs: Accessor<Record<string, string>>; setPath: (arg0: any) => void; }) {
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
          console.log(userDirsList, props.userDirs())
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

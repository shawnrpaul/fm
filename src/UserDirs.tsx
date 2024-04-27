import { For } from "solid-js"

export default function UserDirs(props) {
  const userDirsList = [
    "Home",
    "Documents",
    "Downloads",
    "Music",
    "Pictures",
    "Videos",
  ]

  return <section>
    <ul class="user-dirs">
      <For each={userDirsList} >
        {(item) => <li onClick={() => props.setPath(props.userDirs()![item])}>
          {item}
        </li>}
      </For>
    </ul>
  </section>

}

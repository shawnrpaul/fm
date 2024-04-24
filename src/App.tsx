import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Directory } from "./types";

function App() {
  const [path, setPath] = createSignal("");

  async function get_dir_content() {
    console.log(await invoke("get_dir_content", { path: path() }));
  }

  async function get_user_dirs() {
    let user_dirs = await invoke<Directory[]>("get_user_dirs");
    console.log(user_dirs);
    console.log(await invoke("get_dir_content", { path: user_dirs[0].path }));
  }

  return (
    <div class="container">
      <h1>Welcome to FM!</h1>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          get_dir_content();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setPath(e.currentTarget.value)}
          placeholder="Enter a path..."
        />
        <button type="submit">Get Directory Content</button>
      </form>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          get_user_dirs();
        }}
      >
        <button type="submit">Get User Directories</button>
      </form>

    </div>
  );
}

export default App;

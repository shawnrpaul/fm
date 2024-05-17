import { ContextMenu } from "@kobalte/core/context-menu";
import { Dialog } from "@kobalte/core/dialog";
import { Accessor, For, Setter, createSignal } from "solid-js";
import { Entry } from "./types";
import { Folder, File, FileImage, FileAudio2, FileVideo, X as CrossIcon } from "lucide-solid";
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
  renameSelected: (newName: string) => void
}

export default function ListView(props: Props) {
  const [openDialog, setOpenDialog] = createSignal(false);
  const getIcon = (item: Entry) => {
    if (item.is_dir) return <Folder />
    else if (item.mime_type.startsWith('image')) return <FileImage />
    else if (item.mime_type.startsWith('audio')) return <FileAudio2 />
    else if (item.mime_type.startsWith("video")) return <FileVideo />
    return <File />
  }

  return <Dialog open={openDialog()} modal={true} >
    <ContextMenu>
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
          <ContextMenu.Item class="context-menu__item" onSelect={() => setOpenDialog(true)}>
            Rename<div class="context-menu__item-right-slot">F2</div>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
    <Dialog.Portal>
      <Dialog.Overlay class="dialog__overlay" />
      <div class="dialog__positioner">
        <Dialog.Content class="dialog__content">
          <div class="dialog__header">
            <Dialog.Title class="dialog__title">Rename {props.list.at(props.selectedIndex()!)!.is_dir ? "Folder" : "File"}</Dialog.Title>
            <Dialog.CloseButton class="dialog__close-button" onclick={() => setOpenDialog(false)}>
              <CrossIcon />
            </Dialog.CloseButton>
          </div>
          <Dialog.Description class="dialog__description">
            <form onSubmit={(e) => {
              console.log('in on submit')
              e.preventDefault()
              const data = new FormData(e.target as HTMLFormElement)
              const newPath = data.get('newpath') as string
              props.renameSelected(newPath)
              setOpenDialog(false)
            }}>
              <input type='text' onSubmit={(e) => console.log(e)} name='newpath' value={props.list.at(props.selectedIndex()!)?.path} />
              <button type="submit">Rename</button>
            </form>
          </Dialog.Description>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog>
}

import { ArrowLeft, ArrowRight } from "lucide-solid";
import { PathObj } from "./createHistory";
import { Accessor } from "solid-js";
import SettingsMenu from "./SettingsMenu";
import { AppSettings } from "./types";
import { SetStoreFunction } from "solid-js/store";

interface Props {
  pathObj: PathObj;
  setPath: (path: string) => void;
  path: Accessor<string> | undefined
  settings: AppSettings;
  setSettings: SetStoreFunction<AppSettings>
}

export default function Header(props: Props) {
  return <div class='header'>
    <div class='header-left'>
      <button prop:disabled={!props.pathObj.canGoBack()} onClick={() => props.pathObj.back()}>
        <ArrowLeft size={24} />
      </button>
      <button prop:disabled={!props.pathObj.canGoForward()} onClick={() => props.pathObj.forward()}>
        <ArrowRight size={24} />
      </button>
    </div >
    <form onSubmit={(e) => {
      e.preventDefault()
      const data = new FormData(e.target as HTMLFormElement)
      props.setPath(data.get('path') as string)
    }}>
      <input name='path' value={props.path!()} type='text' />
    </form>
    <div class='header-right'>
      <SettingsMenu  settings={props.settings} setSettings={props.setSettings}/>
    </div>
  </div >
}

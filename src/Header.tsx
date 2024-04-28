import { ArrowLeft, ArrowRight } from "lucide-solid";
import { PathObj } from "./createHistory";
import { Accessor } from "solid-js";

interface Props {
  pathObj: PathObj;
  setPath: (path: string) => void;
  path: Accessor<string> | undefined
}

export default function Header(props: Props) {
  return <div class='header'>
    <button prop:disabled={!props.pathObj.canGoBack()} onClick={() => props.pathObj.back()}>
      <ArrowLeft size={24} />
    </button>
    <button prop:disabled={!props.pathObj.canGoForward()} onClick={() => props.pathObj.forward()}>
      <ArrowRight size={24} />
    </button>
    <form onSubmit={(e) => {
      e.preventDefault()
      const data = new FormData(e.target as HTMLFormElement)
      props.setPath(data.get('path') as string)
    }}>
      <input name='path' value={props.path!()} type='text' />
    </form>
  </div>
}

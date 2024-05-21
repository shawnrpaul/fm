import { For, createEffect, on } from "solid-js";
import { AppSettings, Entry } from "./types";
import { Folder, File, FileImage, FileAudio2, FileVideo } from "lucide-solid";
import { SetStoreFunction } from "solid-js/store";
import { Setter } from "solid-js";

interface Props {
	list: Entry[];
	setList: SetStoreFunction<Entry[]>;
	selected: (key: number | undefined) => boolean;
	selectOrOpen: (item: Entry, index: number) => void;
	setColumnCount: Setter<number>;
	settings: AppSettings;
}

export default function ListView(props: Props) {
	const getIcon = (item: Entry) => {
		if (item.is_dir) return <Folder />;
		else if (item.metadata.mime_type.startsWith("image")) return <FileImage />;
		else if (item.metadata.mime_type.startsWith("audio")) return <FileAudio2 />;
		else if (item.metadata.mime_type.startsWith("video")) return <FileVideo />;
		return <File />;
	};

	const recaulculateCount = () => {
		console.count('column count')
		const count = window.getComputedStyle(document.querySelector('.grid-view')!).gridTemplateColumns.split(' ').length;
		props.setColumnCount(count)
		console.log(count)
	}

	createEffect(on(() => props.settings.view, () => {
		console.count('view')
		if (props.settings.view === "grid")
			recaulculateCount()
	}))

	return (
		<section>
			<ul class={props.settings.view === "grid" ? "grid-view" : "list-view"}>
				<For each={props.list}>
					{(item, index) => (
						<li
							data-index={index()}
							classList={{ selected: props.selected(index()) }}
							tabindex="0"
							onClick={() => props.selectOrOpen(item, index())}
						>
							{getIcon(item)}
							<div><span>{item.name}</span></div>
						</li>
					)}
				</For>
			</ul>
		</section>
	);
}

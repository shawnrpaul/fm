import { For } from "solid-js";
import { Entry } from "./types";
import { Folder, File, FileImage, FileAudio2, FileVideo } from "lucide-solid";
import { SetStoreFunction } from "solid-js/store";

interface Props {
	list: Entry[];
	setList: SetStoreFunction<Entry[]>;
	selected: (key: number | undefined) => boolean;
	selectOrOpen: (item: Entry, index: number) => void;
}

export default function ListView(props: Props) {
	const getIcon = (item: Entry) => {
		if (item.is_dir) return <Folder />;
		else if (item.metadata.mime_type.startsWith("image")) return <FileImage />;
		else if (item.metadata.mime_type.startsWith("audio")) return <FileAudio2 />;
		else if (item.metadata.mime_type.startsWith("video")) return <FileVideo />;
		return <File />;
	};

	return (
		<section class="list-view">
			<ul class="list-view-list">
				<For each={props.list}>
					{(item, index) => (
						<li
							data-index={index()}
							classList={{ selected: props.selected(index()) }}
							tabindex="0"
							onClick={() => props.selectOrOpen(item, index())}
						>
							{getIcon(item)}
							<span>{item.name}</span>
						</li>
					)}
				</For>
			</ul>
		</section>
	);
}

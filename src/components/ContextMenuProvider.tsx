import { ContextMenu } from "@kobalte/core/context-menu";
import { JSX, Setter } from "solid-js";

interface Props {
	setOpenDialog: Setter<boolean>;
	deleteSelected: () => void;
	children: JSX.Element;
}

export default function ContextMenuProvider(props: Props) {
	return (
		<ContextMenu>
			<ContextMenu.Trigger class="context-menu__trigger">
				{props.children}
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content class="context-menu__content">
					<ContextMenu.Item
						class="context-menu__item"
						onSelect={props.deleteSelected}
					>
						Delete <div class="context-menu__item-right-slot">delete</div>
					</ContextMenu.Item>
					<ContextMenu.Item
						class="context-menu__item"
						onSelect={() => props.setOpenDialog(true)}
					>
						Rename<div class="context-menu__item-right-slot">F2</div>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu>
	);
}

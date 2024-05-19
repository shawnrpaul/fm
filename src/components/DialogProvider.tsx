import { Dialog } from "@kobalte/core/dialog";
import { JSX, Setter, Accessor, createEffect, on } from "solid-js";
import { X as CrossIcon } from "lucide-solid";
import { Entry } from "../types";

interface Props {
	list: Entry[];
	children: JSX.Element;
	openDialog: Accessor<boolean>;
	setOpenDialog: Setter<boolean>;
	renameSelected(newPath: string): unknown;
	selectedIndex: Accessor<number | undefined>;
	deleteSelected: () => void;
}

export default function DialogProvider(props: Props) {
	return (
		<Dialog open={props.openDialog()} modal={true}>
			{props.children}
			<Dialog.Portal>
				<Dialog.Overlay class="dialog__overlay" />
				<div class="dialog__positioner">
					<Dialog.Content
						class="dialog__content"
						onEscapeKeyDown={() => {
							props.setOpenDialog(false);
						}}
					>
						<div class="dialog__header">
							<Dialog.Title class="dialog__title">
								Rename{" "}
								{props.list.at(props.selectedIndex() as unknown as number)!
									.is_dir
									? "Folder"
									: "File"}
							</Dialog.Title>
							<Dialog.CloseButton
								class="dialog__close-button"
								onclick={() => props.setOpenDialog(false)}
							>
								<CrossIcon />
							</Dialog.CloseButton>
						</div>
						<Dialog.Description class="dialog__description">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const data = new FormData(e.target as HTMLFormElement);
									const newPath = data.get("newpath") as string;
									props.renameSelected(newPath);
									props.setOpenDialog(false);
								}}
							>
								<input
									type="text"
									name="newpath"
									value={
										props.list.at(props.selectedIndex() as unknown as number)
											?.name
									}
								/>
								<button type="submit">Rename</button>
							</form>
						</Dialog.Description>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog>
	);
}

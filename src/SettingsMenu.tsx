import { DropdownMenu } from "@kobalte/core";
import { Settings, CheckIcon} from "lucide-solid";
import { AppSettings } from "./types";
import { SetStoreFunction } from "solid-js/store";

interface Props {
  settings: AppSettings
  setSettings: SetStoreFunction<AppSettings>
}

export default function SettingsMenu(props: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="dropdown-menu__trigger">
        <DropdownMenu.Icon class="dropdown-menu__trigger-icon">
          <Settings />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="dropdown-menu__content">
          <DropdownMenu.CheckboxItem
            class="dropdown-menu__checkbox-item"
            checked={props.settings.showHidden}
            onChange={(newValue) => props.setSettings('showHidden', newValue)}
          >
            <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Hidden Files
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

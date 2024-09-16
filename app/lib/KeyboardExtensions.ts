import { noop } from "@mantine/core";
import { Extension } from "@tiptap/react";

export const KeyboardExtension = Extension.create({
  name: "keyboardHandler",
  addStorage() {
    return {
      isMobile: false,
      send: noop,
    };
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const mentionsElement = document.getElementById("mention-list");
        if (mentionsElement) {
          return false;
        }

        if (this.storage.isMobile) {
          return editor.commands.first(({ commands }) => [
            () => commands.newlineInCode(),
            () => commands.liftEmptyBlock(),
          ]);
        }
        this.storage.send();
        return this.editor.commands.clearContent();
      },
      "Mod-Enter": ({ editor }) => {
        return editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.liftEmptyBlock(),
        ]);
      },
      "Shift-Enter": ({ editor }) => {
        return editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.liftEmptyBlock(),
        ]);
      },
    };
  },
});

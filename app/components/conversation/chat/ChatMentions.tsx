import { Button, Card } from "@mantine/core";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "./ChatMentions.css";

export type MentionSuggestion = {
  id: string;
  mentionLabel: string;
};

export type MentionRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

interface MentionProps extends SuggestionProps {
  items: MentionSuggestion[];
}

const MentionList = forwardRef<MentionRef, MentionProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    if (index >= props.items.length) {
      // Make sure we actually have enough items to select the given index. For
      // instance, if a user presses "Enter" when there are no options, the index will
      // be 0 but there won't be any items, so just ignore the callback here
      return;
    }

    const suggestion = props.items[index];

    // Set all of the attributes of our Mention based on the suggestion data. The fields
    // of `suggestion` will depend on whatever data you return from your `items`
    // function in your "suggestion" options handler. We are returning the
    // `MentionSuggestion` type we defined above, which we've indicated via the `items`
    // in `MentionProps`.
    const mentionItem = {
      id: suggestion.id,
      label: suggestion.mentionLabel,
    };
    props.command(mentionItem);
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <Card
      style={{ overlow: "auto", position: "relative" }}
      withBorder
      shadow="sm"
      p="6px"
      radius="md"
      id="mention-list" //for keyboard extension when "ENTER" is pressed
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <Button
            variant={index === selectedIndex ? "filled" : "transparent"}
            key={index}
            size="compact-md"
            onClick={() => selectItem(index)}
            justify="flex-start"
            c="black"
            color="gray.3"
            fz="sm"
            fw="500"
          >
            {item.mentionLabel}
          </Button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </Card>
  );
});

MentionList.displayName = "MentionList";

export { MentionList };

import React from "react";

const useCommandShortcut = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return [open, setOpen];
};

export default useCommandShortcut;

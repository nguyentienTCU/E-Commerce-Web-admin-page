"use client";
import React, { useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface MultiSelectProps {
  placeholder: string;
  value: string[];
  collections: CollectionType[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  value,
  collections,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  const selectables = collections.filter(
    (collection) => !selected.includes(collection)
  );

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <Command className="overflow-visible bg-white">
      <div>
        {selected.map((collection) => (
          <Badge key={collection._id} className="bg-grey-1 text-white">
            {collection.title}
            <button
              className="ml-1 rounded-full outline-none bg-grey-1 hover:text-red-600 w-2 h-6"
              onClick={() => onRemove(collection._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          className="border rounded-md"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>
      <div className="relative mt-2">
        {open && (
          <CommandList>
            <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
              {selectables.map((collection) => (
                <CommandItem
                  key={collection._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => {
                    onChange(collection._id);
                    setInputValue("");
                  }}
                  className="cursor-pointer hover:bg-grey-2"
                >
                  {collection.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;

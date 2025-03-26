"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import "../../app/globals.css";

interface MultiTextProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const addValue = (item: string) => {
    onChange(item);
    setInputValue("");
  };
  return (
    <>
      <div>
        {value.map((item, index) => (
          <Badge key={index} className="bg-grey-1 text-white">
            {item}
            <button
              className="ml-1 rounded-full outline-none bg-grey-1 hover:text-red-600 w-2 h-6"
              onClick={() => onRemove(item)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue(inputValue);
            }
          }}
        />
      </div>
    </>
  );
};

export default MultiText;

import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect } from "react";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  endContent,
  disabled = true,
  loading = false,
}: StreamingAvatarTextInputProps) {
  // Function to handle external input
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).setTranscriptionInput = function (text: string) {
        const inputField = document.getElementById("transcription") as HTMLInputElement;
        if (inputField) {
          setInput(text); // Update React state
          inputField.value = text; // Update the DOM input field value
          const event = new Event("input", { bubbles: true });
          inputField.dispatchEvent(event); // Trigger React's state update
        } else {
          console.error("Input field not found!");
        }
      };
    }
  }, [setInput]);

  function handleSubmit() {
    if (input.trim() === "") {
      return;
    }
    onSubmit();
    setInput(""); // Clear the input after submission
  }

  return (
    <Input
      id="transcription"
      endContent={
        <div className="flex flex-row items-center h-full">
          {endContent}
          <Tooltip content="Send message">
            {loading ? (
              <Spinner
                className="text-indigo-300 hover:text-indigo-200"
                size="sm"
                color="default"
              />
            ) : (
              <button
                type="submit"
                className="focus:outline-none"
                onClick={handleSubmit}
              >
                <PaperPlaneRight
                  className={clsx(
                    "text-indigo-300 hover:text-indigo-200",
                    disabled && "opacity-50"
                  )}
                  size={24}
                />
              </button>
            )}
          </Tooltip>
        </div>
      }
      label={label}
      placeholder={placeholder}
      size="sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
      onValueChange={setInput}
      isDisabled={disabled}
    />
  );
}
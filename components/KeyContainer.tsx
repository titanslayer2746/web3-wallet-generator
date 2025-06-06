import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

const KeyContainer = ({ title, keyval }: { title: string; keyval: string }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (keyval) {
      await navigator.clipboard.writeText(keyval);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={keyval}
          readOnly
          placeholder="Enter your key"
          className="pr-20"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-10 top-1/2 -translate-y-1/2"
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={handleCopy}
          tabIndex={-1}
        >
          {copied ? (
            <Check size={18} className="text-gray-500" />
          ) : (
            <Copy size={18} className="text-gray-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default KeyContainer;

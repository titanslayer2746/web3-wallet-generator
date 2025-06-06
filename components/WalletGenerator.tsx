"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import KeyContainer from "./KeyContainer";
import { generateNextWallet } from "@/lib/generateWallet";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface WalletInfo {
  address: string;
  publicKey: string;
  privateKey: string;
}

export default function WalletGenerator() {
  const [wallets, setWallets] = useState<Array<WalletInfo> | null>(null);
  const [walletIndex, setWalletIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState<Array<string> | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (mnemonic) {
      const mnemonicStr = mnemonic.join(" ");
      await navigator.clipboard.writeText(mnemonicStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const generateSeed = () => {
    setIsLoading(true);
    try {
      // Generate a random mnemonic (12 words)
      const m = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));

      const arr = m.split(" ");
      setMnemonic(arr);
      toast("New Seed phrase has been created!!");
    } catch (error) {
      console.error("Error generating seed phrase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWallet = () => {
    setIsLoading(true);
    try {
      if (!mnemonic) throw new Error("Mnemonic not generated");
      const mnemonicStr = mnemonic.join(" ");
      const walletInstance = generateNextWallet({
        mnemonicstr: mnemonicStr,
        walletIndex,
      });
      let temp = walletIndex;
      temp++;
      setWalletIndex(temp);
      const newWallet: WalletInfo = {
        address: walletInstance.address,
        publicKey: walletInstance.publicKey,
        privateKey: walletInstance.privateKey,
      };

      setWallets((wallets) => [...(wallets ?? []), newWallet]);
      toast("New wallet has been added!!");
    } catch (error) {
      console.error("Error generating wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-6">Web3 Wallet Generator</h1>
      </div>
      <div className="space-y-6">
        {/* Generate New Wallet Section */}
        <div className="flex flex-row space-x-8 justify-between">
          {!mnemonic && (
            <Button
              onClick={generateSeed}
              disabled={isLoading}
              className={cn("hover:cursor-pointer")}
            >
              {isLoading ? "Generating..." : "Generate Seed Phrase"}
            </Button>
          )}

          {mnemonic && (
            <div>
              <Button
                onClick={generateWallet}
                disabled={isLoading}
                className={cn("hover:cursor-pointer")}
              >
                {isLoading ? "Generating..." : "Add wallet"}
              </Button>
            </div>
          )}

          <ModeToggle />
        </div>

        {mnemonic && (
          <div className="flex flex-row justify-evenly space-y-10 blur-sm hover:blur-none transition-all">
            <div className="flex flex-col space-y-6">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="flex flex-row justify-between space-x-6"
                >
                  {mnemonic?.slice(row * 4, row * 4 + 4).map((word, idx) => (
                    <div
                      key={idx}
                      className="w-32 border rounded px-3 py-2 flex flex-col bg-muted"
                    >
                      <span className="text-xs text-gray-500">
                        {row * 4 + idx + 1}
                      </span>
                      <span className="font-mono">{word}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {mnemonic && (
          <div className="flex justify-center">
            <div className="flex flex-row">
              <p>Copy the seed phrase</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative hover:cursor-pointer"
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
        )}

        {wallets &&
          wallets.map((wallet, idx) => (
            <div key={idx}>
              <p className="font-bold text-3xl">Wallet {idx + 1}</p>
              <KeyContainer title="Address" keyval={wallet.address} />
              <KeyContainer title="Private Key" keyval={wallet.privateKey} />
              <KeyContainer title="Public Key" keyval={wallet.publicKey} />
            </div>
          ))}
      </div>
    </div>
  );
}

import { ethers } from "ethers";

export function generateNextWallet({
  mnemonicstr,
  walletIndex,
}: {
  mnemonicstr: string;
  walletIndex: number;
}) {
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonicstr);
  const path = `m/44'/60'/0'/0/${walletIndex}`;
  const wallet = hdNode.derivePath(path);

  return {
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
  };
}

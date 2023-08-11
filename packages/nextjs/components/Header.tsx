import React from "react";
import Link from "next/link";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="mt-5 mx-10 p-10 rounded-[20px]  bg-white justify-between z-20 flex">
      <div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6">
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Wibu NFT</span>
            <span className="text-xs">NFT for Onion Person</span>
          </div>
        </Link>
      </div>
      <div className="flex">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};

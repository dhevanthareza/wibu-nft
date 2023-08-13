import { useEffect, useState } from "react";
import { Card, Input, List, Modal } from "antd";
import axios from "axios";
import { create } from "ipfs-http-client";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import nfts from "~~/constant/nfts";
import { notification } from "~~/utils/scaffold-eth";
import {
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const projectId = "2GajDLTC6y04qsYsoDRq9nGmWwK";
  const projectSecret = "48c62c6b3f82d2ecfa2cbe4c90f97037";
  const projectIdAndSecret = `${projectId}:${projectSecret}`;
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: { authorization: `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}` },
  });

  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [activeNft, setActiveNft] = useState<any>({});
  const [isTransfer, setIsTransfer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [yourCollectibles, setYourCollectibles] = useState<any[]>([]);
  const [yourCollectibleIds, setYourCollectiblesIds] = useState<any>([]);
  const [transferDestinationvalue, setTransferDestinationvalue] = useState("");

  const handleTransferInputChange = (event: any) => {
    setTransferDestinationvalue(event.target.value);
  };

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "OnionWibuNft",
    functionName: "mintItem",
    args: [address, ""],
    onBlockConfirmation: (txnReceipt: any) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      // updateYourCollectible();
      setIsMinting(false);
    },
    onError: () => {
      setIsMinting(false);
    },
  });

  const { writeAsync: transferNft } = useScaffoldContractWrite({
    contractName: "OnionWibuNft",
    functionName: "transferFrom",
    args: [address, "", BigInt(0)],
    onBlockConfirmation: (txnReceipt: any) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      // updateYourCollectible();
      setIsTransferModalOpen(false);
    },
    onError: () => {
      setIsTransferModalOpen(false);
    },
  });

  const { data: onionWibuNftContract } = useScaffoldContract({
    contractName: "OnionWibuNft",
  });

  const { data: nftBalance } = useScaffoldContractRead({
    contractName: "OnionWibuNft",
    functionName: "balanceOf",
    args: [address],
  });

  const mintItem = async () => {
    // upload to ipfs
    if(address == null || address == undefined) {
      notification.error("Please connect your wallet");
      return;
    }
    if (isMinting) {
      return;
    }
    setIsMinting(true);
    const randomDecimal = Math.random();
    const randomNftIndex: number = Math.floor(randomDecimal * (nfts.length - 1));
    const uploaded = await ipfs.add(JSON.stringify(nfts[randomNftIndex]));
    const nftPath = uploaded.path;
    console.log(`UPLOADED NFT PATH ${uploaded.path} ${nftPath}`);
    console.log(`CURRENT ADDRESS ${address}`);
    writeAsync({ args: [address, nftPath] });
  };

  const updateYourCollectible = async () => {
    setIsRefreshing(true);
    const collectibles: any[] = [];
    if(nftBalance == null || nftBalance == undefined) {
      return;
    }
    for (let tokenIndex = 0; tokenIndex < nftBalance; tokenIndex++) {
      let token = null;
      try {
        token = await onionWibuNftContract?.read.tokenOfOwnerByIndex([`${address}`, BigInt(tokenIndex)]);
      } catch (err) {
        token = null;
      }
      if (token == null) {
        continue;
      }
      const data = await loadCollectible(token);
      if (data == null) {
        continue;
      }
      collectibles.push(data);
    }
    setYourCollectibles(collectibles.reverse());
    setIsRefreshing(false);
  };

  const loadCollectible = async (tokenId: any) => {
    // console.log(`TRY LOADING Collectible Id ${tokenId}`);
    if (yourCollectibleIds.includes(tokenId)) {
      console.log(`Already have Collectibles ${tokenId}`);
      return null;
    }
    const tokenURI: any = await onionWibuNftContract?.read.tokenURI([tokenId]);
    if (!`${tokenURI}`.includes("-")) {
      try {
        const jsonData: any = await axios.get(tokenURI);
        jsonData.data.tokenId = tokenId;
        return jsonData.data;
        // refreshCollectible()
      } catch (err) {
        console.log(err);
        return null;
      }
    }
    return null;
  };

  const handleTransferNft = async (tokenId: bigint) => {
    setIsTransfer(true);
    await transferNft({ args: [address, transferDestinationvalue, tokenId] });
    setIsTransfer(false);
  };

  useEffect(() => {
    updateYourCollectible();
  }, [nftBalance, address]);

  return (
    <>
      <MetaHeader />
      <div className="mx-20 mt-10 text-primary">
        <h1 className="mb-8">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Wibu NFT, Grab Your NFT</span>
        </h1>

        <div className="flex">
          <div>
            <div onClick={mintItem} className="btn btn-lg btn-block bg-white text-black hover:text-white">
              {isMinting ? "MINTING ....." : "MINT YOUR NFT"}
            </div>
          </div>
        </div>

        <h1 className="mt-20">
          <span className="block text-4xl font-bold">Your Nfts</span>
        </h1>
        <List
          className="mt-10"
          dataSource={yourCollectibles}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 6,
          }}
          renderItem={(item, index) => {
            return (
              <List.Item>
                <Card style={{ width: 240 }} cover={<img alt="example" src={item.image} />}>
                  <span className="font-bold">{item.name}</span>
                  <span className="">, {item.description}</span>
                  <div
                    onClick={() => {
                      setIsTransferModalOpen(true);
                      setActiveNft(item);
                    }}
                    className="btn bg-primary btn-block mt-5"
                  >
                    Transfer NFT
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
        <Modal
          title="Transfer NFT"
          open={isTransferModalOpen}
          onCancel={() => {
            setIsTransferModalOpen(false);
          }}
          footer={[]}
        >
          <div className="flex items-center justify-center">
            <Card className="mr-5" style={{ width: 240 }} cover={<img alt="example" src={activeNft.image} />}>
              <span className="font-bold">{activeNft.name}</span>
            </Card>
            <div>
              <Input
                size="large"
                placeholder="Destination Address"
                value={transferDestinationvalue}
                onChange={handleTransferInputChange}
              />
              <div
                onClick={() => {
                  handleTransferNft(activeNft.tokenId);
                }}
                className="btn bg-primary btn-block mt-5"
              >
                { isTransfer ? "Transferring...." : "Transfer NFT"}
              </div>
              <div onClick={() => {setIsTransferModalOpen(false)}} className="btn bg-white hover:bg-white text-black btn-block mt-2">Cancel</div>
            </div>
          </div>
        </Modal>
        <div
          onClick={updateYourCollectible}
          className="btn btn-lg btn-block bg-white text-black hover:text-white rounded-[100px]"
        >
          Refresh Your NFTS
        </div>
      </div>
    </>
  );
};

export default Home;

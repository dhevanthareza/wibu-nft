import { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import {create} from "ipfs-http-client";
const Home: NextPage = () => {
  const projectId = "2GajDLTC6y04qsYsoDRq9nGmWwK";
const projectSecret = "48c62c6b3f82d2ecfa2cbe4c90f97037";
const projectIdAndSecret = `${projectId}:${projectSecret}`;
  const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
    headers: { authorization: `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}` },
  });
  const nfts = [
    {
      description: "It's actually a bison?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/buffalo.jpg",
      name: "Buffalo",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "green",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 42,
        },
      ],
    },
    {
      description: "What is it so worried about?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/zebra.jpg",
      name: "Zebra",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "blue",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 38,
        },
      ],
    },
    {
      description: "What a horn!",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/rhino.jpg",
      name: "Rhino",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "pink",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 22,
        },
      ],
    },
    {
      description: "Is that an underbyte?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/fish.jpg",
      name: "Fish",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "blue",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 15,
        },
      ],
    },
    {
      description: "So delicate.",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/flamingo.jpg",
      name: "Flamingo",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "black",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 6,
        },
      ],
    },
    {
      description: "Raaaar!",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/godzilla.jpg",
      name: "Godzilla",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "orange",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 99,
        },
      ],
    },
  ];

  const mintItem = async () => {
    // upload to ipfs
    const uploaded = await ipfs.add(JSON.stringify(nfts[0]));
    console.log("Uploaded Hash: ", uploaded);
    // const result = tx(
    //   writeContracts &&
    //     writeContracts.YourCollectible &&
    //     writeContracts.YourCollectible.mintItem(address, uploaded.path),
    //   update => {
    //     console.log("📡 Transaction Update:", update);
    //     if (update && (update.status === "confirmed" || update.status === 1)) {
    //       console.log(" 🍾 Transaction " + update.hash + " finished!");
    //       console.log(
    //         " ⛽️ " +
    //           update.gasUsed +
    //           "/" +
    //           (update.gasLimit || update.gas) +
    //           " @ " +
    //           parseFloat(update.gasPrice) / 1000000000 +
    //           " gwei",
    //       );
    //     }
    //   },
    // );
  };
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
            <div onClick={mintItem} className="btn btn-lg btn-block bg-white text-black hover:text-white">MINT YOUR NFT</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

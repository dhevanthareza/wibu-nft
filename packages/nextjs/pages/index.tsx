import { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="mx-20 mt-10 text-white">
        <h1 className="mb-8">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Wibu NFT, Grab Your NFT</span>
        </h1>

        <div className="flex">
          <div>
            <div className="btn btn-lg btn-block bg-white text-black">MINT YOUR NFT</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

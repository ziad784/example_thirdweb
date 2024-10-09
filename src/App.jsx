import "./App.css";
import React, { useContext, useEffect, useState } from "react";

import {
  createThirdwebClient,
  defineChain,
  getContract,
  sendAndConfirmTransaction,
  sendTransaction,
  toTokens,
} from "thirdweb";
import { buyFromListing } from "thirdweb/extensions/marketplace";
import {
  PayEmbed,
  useActiveAccount,
  BuyDirectListingButton,
  TransactionButton,
  ConnectButton,
} from "thirdweb/react";

import { arbitrum, arbitrumSepolia } from "thirdweb/chains";
import { approve, decimals } from "thirdweb/extensions/erc20";

function BuyBox() {
  const userAddress = useActiveAccount()?.address;
  const account = useActiveAccount();
  const [LootBoxData, setLootBoxData] = useState({
    assetContractAddress: "0xAbDa30eC61E25e740CD7c2BBD74DBbb7ecefafB4",
    currencyContractAddress: "0xf3D534cCB08b5b66Bf1680A2Fb95280d0a7C213d",
    pricePerToken: "3990000000000000000",
    currencyValuePerToken: {
      name: "PUSD",
      symbol: "PUSD",
      decimals: 18,
      value: {
        type: "BigNumber",
        hex: "0x375f53dc2dcf0000",
      },
      displayValue: "3.99",
    },
    id: "44",
    tokenId: "12",
    quantity: "271",
    startTimeInSeconds: 1726410822,
    asset: {
      name: "Plays Test Lootbox 12",
      description:
        "The Plays Lootbox contains PLAYS and GEMS ERC20 tokens and Character and Spellbook ERC1155 NFTs.",
      image:
        "https://a3fcbaf0762b9381b135c378d49c2499.ipfscdn.io/ipfs/bafybeid4t7cy4zgpzomddswhh5l4ozjz4t7kkbt4rzrqafnkxepo5x75ua/",
      id: "12",
      uri: "ipfs://QmTc41Wss1cvnWX7GyyiPF7zKmCXmfi8B671y2HFH5zViv/0",
    },
    endTimeInSeconds: 4882084421,
    creatorAddress: "0xA882BDF11100d55cc8f8674C004218f3cA092c74",
    isReservedListing: false,
    status: 4,
  });

  const client = createThirdwebClient({
    clientId: "a3fcbaf0762b9381b135c378d49c2499",
  });

  const contract = getContract({
    client,
    chain: defineChain(421614),
    address: "0x4b5313C49fAaFA944AF774745Ae167A6f88ADB06",
  });

  const [Quantity, setQuantity] = useState("1");

  const marketplaceContract = getContract({
    client,
    chain: defineChain(421614),
    address: "0x4b5313C49fAaFA944AF774745Ae167A6f88ADB06",
  });

  async function BuyNow() {
    const customTokenContract = getContract({
      address: LootBoxData?.currencyContractAddress,
      client,
      chain: arbitrumSepolia,
    });

    const _decimals = await decimals({
      contract: customTokenContract,
    });
    const transaction = approve({
      contract: customTokenContract,
      spender: "0x4b5313C49fAaFA944AF774745Ae167A6f88ADB06",
      amount: toTokens(LootBoxData?.pricePerToken, _decimals),
    });
    await sendAndConfirmTransaction({ transaction, account });

    const transaction_buy = buyFromListing({
      contract: marketplaceContract,
      listingId: LootBoxData?.id,
      quantity: Quantity,
      recipient: account.address,
    });

    const receipt = await sendTransaction({
      transaction_buy,
      account,
    });
    await waitForReceipt({
      transactionHash: receipt.transactionHash,
      client,
      chain: arbitrumSepolia,
    });

    alert("Payment!!");
  }

  return (
    <div>
      <ConnectButton client={client} />
      {account && <button onClick={BuyNow}>Buy</button>}
    </div>
  );
}

export default BuyBox;

import { Buffer } from "buffer";
window.Buffer = Buffer;
import {
  PROGRAM_ID,
  createRepayRoyaltiesInstruction,
} from "@builderz/royalty-solution";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { NftData } from "../data/types";
import { toast } from "react-toastify";

export const tryFn = async (fn: any) => {
  try {
    return await fn;
  } catch (error) {
    return null;
  }
};

export const repayRoyalties = async (
  nfts: NftData[],
  connection: Connection,
  wallet: WalletContextState,
  fee: number
) => {
  const txInstructions = [];
  const readyTransactions: Transaction[] = [];

  const toastId = toast.loading("Setting up Transaction...");

  const totalAmount = 0;

  for (const nft of nfts) {
    // Get Creators
    const creators = nft.creators;
    const remainingAccounts: Array<{
      pubkey: PublicKey;
      isWritable: boolean;
      isSigner: boolean;
    }> = [];
    creators?.forEach((creator: any) => {
      remainingAccounts.push({
        pubkey: new PublicKey(creator.address),
        isWritable: true,
        isSigner: false,
      });
    });

    const nftMint = new PublicKey(nft.id);

    // Program action
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        new PublicKey(nftMint).toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    const [nftStateAddress] = PublicKey.findProgramAddressSync(
      // @ts-ignore
      [Buffer.from("nft-state"), new PublicKey(nftMint).toBuffer()],
      PROGRAM_ID
    );

    if (!nft.renaissance?.royaltiesToPay) {
      continue;
    }

    txInstructions.push(
      createRepayRoyaltiesInstruction(
        {
          nftState: nftStateAddress,
          // @ts-ignore
          nftMint: new PublicKey(nftMint),
          nftMintMetadata: metadataAddress,
          user: wallet.publicKey!,
          anchorRemainingAccounts: remainingAccounts,
        },
        {
          royaltiesToPay: nft.renaissance?.royaltiesToPay,
        }
      )
    );
  }

  // If we take a fee
  if (fee) {
    txInstructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new PublicKey("BRW3seabArRtcrUMT8u7Sg61dVNKBT3yJ8gHbFzNYjFY"),
        lamports: Math.floor(totalAmount * fee),
      })
    );
  }

  const batchSize = 4;
  const numTransactions = Math.ceil(txInstructions.length / batchSize); // How many instructions can fit?

  for (let i = 0; i < numTransactions; i++) {
    const bulkTransaction = new Transaction();
    const lowerIndex = i * batchSize;
    const upperIndex = (i + 1) * batchSize;
    for (let j = lowerIndex; j < upperIndex; j++) {
      // @ts-ignore
      if (txInstructions[j] && txInstructions[j].length) {
        // @ts-ignore
        bulkTransaction.add(txInstructions[j][0]);
        // @ts-ignore
        bulkTransaction.add(txInstructions[j][1]);
      } else if (txInstructions[j]) {
        bulkTransaction.add(txInstructions[j]);
      }
    }
    readyTransactions.push(bulkTransaction);
  }

  toast.update(toastId, {
    render: "Finished Building Transactions, Sending Transaction...",
  });

  // Send transactions
  try {
    const blockhash = await connection.getLatestBlockhash();

    readyTransactions.forEach((tx) => {
      tx.feePayer = wallet.publicKey!;
      tx.recentBlockhash = blockhash.blockhash;
    });

    const transactionsToSend = await wallet.signAllTransactions!(
      readyTransactions
    );

    const promises = transactionsToSend.map(async (tx) => {
      console.log(tx);

      return await connection.sendRawTransaction(tx.serialize());
    });

    const sigs = await Promise.all(promises);

    const promises2 = sigs.map(async (sig) => {
      return await connection.confirmTransaction(
        {
          signature: sig,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight,
        },
        "finalized"
      );
    });

    toast.update(toastId, { render: "Confirming Transactions" });

    const txConfirmations = await Promise.allSettled(promises2);

    toast.update(toastId, {
      render: "Success, reloading NFTs...",
    });

    return toastId;
  } catch (error) {
    console.log(error);
    toast.update(toastId, {
      render: "Something went wrong, please try again",
      type: toast.TYPE.ERROR,
      autoClose: 5000,
      isLoading: false,
    });
  }
};

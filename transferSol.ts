import { Connection, Transaction, SystemProgram, PublicKey, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
import base58 from "bs58";
require("dotenv").config();

const suppliedToPubkey = process.argv[2] || null;
if (!suppliedToPubkey) {
  throw new Error("Recipient is not specified");
}

console.log("Supplied to public key:", suppliedToPubkey);

const privateKeyBase58 = process.env.PRIVATE_KEY;
if (!privateKeyBase58) {
  throw new Error("Private key is not set in environment variables");
}

const privateKeyDecoded = base58.decode(privateKeyBase58);
const senderKeypair = Keypair.fromSecretKey(privateKeyDecoded);

const toPubKey = new PublicKey(suppliedToPubkey);
const connection = new Connection(clusterApiUrl("devnet"));

const balance = await connection.getBalance(senderKeypair.publicKey);

console.log('the balance is ', balance);

async function sendSol() {
  try {
    console.log(
      `✅ Loaded our own keypair, the destination public key, and connected to Solana: ${senderKeypair.publicKey}`
    );

    // const { blockhash } = await connection.getLatestBlockhash("finalized");
    // console.log("Blockhash:", blockhash);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: toPubKey,
        lamports: LAMPORTS_PER_SOL * 1, // 1 SOL
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    console.log(
      `💸 Finished! Sent 1 SOL to the address ${toPubKey}. Transaction signature is ${signature}!`
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

sendSol();
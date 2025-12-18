import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  ComputeBudgetProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TOKEN_ADDRESS, TokenTicker } from '../types';
import { toBaseUnits } from './jupiter_swap';

/**
 * Build SPL token transfer transaction (unsigned) using Legacy Message
 *
 * Uses Legacy Message instead of V0 to ensure compatibility.
 * Always fetches fresh blockhash for sequential execution.
 *
 * Uses @solana/spl-token for ATA derivation and instruction building.
 */
export async function buildTokenTransferTransaction(
  connection: Connection,
  senderPublicKey: PublicKey,
  token: TokenTicker,
  recipientAddress: string,
  amount: number
): Promise<VersionedTransaction> {
  const mintAddressStr = TOKEN_ADDRESS[token];
  if (!mintAddressStr) {
    throw new Error(`Unknown token: ${token}`);
  }

  const mintAddress = new PublicKey(mintAddressStr);
  const recipientPubkey = new PublicKey(recipientAddress);

  // Derive ATAs using @solana/spl-token
  const sourceATA = await getAssociatedTokenAddress(
    mintAddress,
    senderPublicKey,
    false,
    TOKEN_PROGRAM_ID
  );

  const destinationATA = await getAssociatedTokenAddress(
    mintAddress,
    recipientPubkey,
    false,
    TOKEN_PROGRAM_ID
  );

  // Build instructions array
  const instructions: TransactionInstruction[] = [];

  // Add compute budget instructions
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 })
  );
  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 })
  );

  // Check if destination ATA exists
  const destinationAccountInfo = await connection.getAccountInfo(destinationATA);

  if (!destinationAccountInfo) {
    // Create ATA for recipient
    const createATAIx = createAssociatedTokenAccountInstruction(
      senderPublicKey,  // payer
      destinationATA,   // ata
      recipientPubkey,  // owner
      mintAddress,      // mint
      TOKEN_PROGRAM_ID
    );
    instructions.push(createATAIx);
  }

  // Create transfer instruction
  const transferAmount = toBaseUnits(amount, token);
  const transferIx = createTransferInstruction(
    sourceATA,        // source
    destinationATA,   // destination
    senderPublicKey,  // owner
    transferAmount,   // amount
    [],               // multiSigners
    TOKEN_PROGRAM_ID
  );
  instructions.push(transferIx);

  // Always fetch fresh blockhash for sequential execution
  const { blockhash } = await connection.getLatestBlockhash('confirmed');

  // Build transaction using Legacy Message (Jito compatible - no ALT)
  const legacyMessage = new TransactionMessage({
    payerKey: senderPublicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToLegacyMessage();

  const transaction = new VersionedTransaction(legacyMessage);

  // Verify base64 serialization
  verifyTransactionSerializable(transaction);

  return transaction;
}

/**
 * Verify transaction can be serialized to base64 (for Jito bundle)
 */
function verifyTransactionSerializable(transaction: VersionedTransaction): void {
  try {
    const serialized = transaction.serialize();
    const base64 = Buffer.from(serialized).toString('base64');

    // Verify round-trip
    const decoded = Buffer.from(base64, 'base64');
    VersionedTransaction.deserialize(decoded);

    // Check transaction size limit
    if (serialized.length > 1232) {
      console.warn(`Transaction size (${serialized.length} bytes) exceeds limit.`);
    }
  } catch (error) {
    throw new Error(`Transaction serialization failed: ${error}`);
  }
}

/**
 * Get transaction as base64 string
 */
export function getTransactionBase64(transaction: VersionedTransaction): string {
  return Buffer.from(transaction.serialize()).toString('base64');
}
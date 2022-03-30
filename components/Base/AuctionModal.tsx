/* eslint-disable jsx-a11y/alt-text */
import { randomBytes } from "crypto";
import React, { ChangeEvent, useEffect, useState, useReducer } from "react";
import Modal from "react-modal";

import NextImage from "next/image";
import Image from "./Image";
import styles from "./AuctionModal.module.css";
import { TransactionResult } from "../Auction/CreateAuction";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

enum AuctionCreationStatus {
  Idle = "Idle",
  Pending = "Pending",
  Success = "Success",
  TransactionApproved = "TransactionApproved",
  Error = "Error",
}

export default function AuctionModal({
  createAuction,
}: {
  createAuction: (
    imageUrl: string,
    bidTime: number
  ) => Promise<TransactionResult[]>;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [bidTime, setBidTime] = useState(5);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [transactionId, setTransactionId] = useState("");
  const [creationStatus, setCreationStatus] = useState<AuctionCreationStatus>(
    AuctionCreationStatus.Idle
  );

  useEffect(() => {
    if (!modalIsOpen) return;
    setImageUrl(
      `https://picsum.photos/seed/${randomBytes(16).toString("hex")}/300`
    );
  }, [modalIsOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setTransactionId("");
    setCreationStatus(AuctionCreationStatus.Idle);
    setIsOpen(false);
  };

  const onCreateClick = async () => {
    setCreationStatus(AuctionCreationStatus.Pending);
    try {
      const [transaction] = await createAuction(imageUrl, bidTime);

      const txHash = await transaction.getHash();
      setTransactionId(txHash);

      setCreationStatus(AuctionCreationStatus.TransactionApproved);

      await transaction.waitReceipt();
      setCreationStatus(AuctionCreationStatus.Success);
    } catch (e) {
      console.error(e);
      setCreationStatus(AuctionCreationStatus.Error);
    }
  };

  const onInputChange = (event: ChangeEvent<{ value: string }>) => {
    setImageUrl(event.target.value);
  };

  const createAuctionForm = (
    <>
      <div>
        <div className={styles.inputSection}>
          <label htmlFor="url">Image URL to be auctioned</label>
          <input type="url" value={imageUrl} onChange={onInputChange} />
        </div>
        <div className={styles.inputSection}>
          <label htmlFor="bidtime">Duration of the auction (in minutes)</label>
          <input
            type="number"
            value={bidTime}
            onChange={(event) => setBidTime(Number(event.target.value.trim()))}
          />
        </div>
        <Image url={imageUrl} />
      </div>
    </>
  );

  const transactionIdElement = (
    <div className={styles.transactionId}>
      Transaction ID
      <br />
      {transactionId}
    </div>
  );
  let modalContent = null;
  switch (creationStatus) {
    case AuctionCreationStatus.Pending:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.spinner}>
            <NextImage src="/loader.svg" alt="Conference Logo" layout="fill" />
          </div>
          <div>Check wallet to approve transaction...</div>
        </div>
      );
      break;
    case AuctionCreationStatus.Error:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.emoji}>❌</div>
          <div>Error processing transaction</div>
          {transactionIdElement}
        </div>
      );
      break;
    case AuctionCreationStatus.Idle:
      modalContent = createAuctionForm;
      break;
    case AuctionCreationStatus.TransactionApproved:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.spinner}>
            <NextImage src="/loader.svg" alt="Conference Logo" layout="fill" />
          </div>
          <div>☑️ Transaction approved!</div>
          <div>
            Waiting for transaction to be processed in Celo blockchain...
          </div>
          {transactionIdElement}
        </div>
      );
      break;
    case AuctionCreationStatus.Success:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.emoji}>👏</div>
          <div>Auction created!</div>
          {transactionIdElement}
        </div>
      );
      break;
    default:
      break;
  }

  const disabledButton = creationStatus !== AuctionCreationStatus.Idle;
  return (
    <div className={styles.container}>
      <button className={styles.createAuctionButton} onClick={openModal}>
        Create auction
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create auction"
        ariaHideApp={false}
      >
        <div className={styles.modalBody}>
          <h2>Create auction</h2>
          {modalContent}
          <div className={styles.buttonSection}>
            <button onClick={closeModal} className={styles.closeButton}>
              Close
            </button>
            <button onClick={onCreateClick} disabled={disabledButton}>
              Create auction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

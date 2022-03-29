/* eslint-disable jsx-a11y/alt-text */
import { randomBytes } from "crypto";
import React, { ChangeEvent, useEffect, useState, useReducer } from "react";
import Modal from "react-modal";

import NextImage from "next/image";
import Image from './Image';
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

enum Status {
  Idle = "Idle",
  Pending ="Pending",
  Success=  "Success",
  TransactionApproved =  "TransactionApproved",
  Error=  "Error"
};

export default function AuctionModal({
  createAuction,
}: {
  createAuction: (imageUrl: string, bidTime: number) => Promise<TransactionResult[]>;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [bidTime, setBidTime] = useState(5);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [creationStatus, setCreationStatus] = useState<Status>(Status.Idle);

  useEffect(() => {
    if (!modalIsOpen) return;
    setImageUrl(`https://picsum.photos/seed/${randomBytes(16).toString("hex")}/300`);
  }, [modalIsOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setCreationStatus(Status.Idle);
    setIsOpen(false);
  };

  const onCreateClick = async () => {
    setCreationStatus(Status.Pending);
    try {
      const [transaction] = await createAuction(imageUrl, bidTime);

      await transaction.getHash();
      setCreationStatus(Status.TransactionApproved);

      await transaction.waitReceipt();
      setCreationStatus(Status.Success);
    } catch (e) {
      setCreationStatus(Status.Error);
    }
  }

  const onInputChange = (event: ChangeEvent<{ value: string }>) => {
    setImageUrl(event.target.value)
  }

  const createAuctionForm = (
    <>
      <div>
        <div className={styles.inputSection}>
          <label htmlFor="url">Image URL to be auctioned</label>
          <input
            type="url"
            value={imageUrl}
            onChange={onInputChange}
          />
        </div>
        <div className={styles.inputSection}>
          <label htmlFor="bidtime">
            Duration of the auction (in minutes)
          </label>
          <input
            type="number"
            value={bidTime}
            onChange={(event) =>
              setBidTime(Number(event.target.value.trim()))
            }
          />
        </div>
        <Image url={imageUrl} />
      </div>
    </>
  );

  let modalContent = null;
  switch (creationStatus) {
    case Status.Pending:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.spinner}>
          <NextImage
            src="/loader.svg"
            alt="Conference Logo"
            layout="fill"
          />
          </div>
          <div>Check wallet to approve transaction...</div>
        </div>
      );
      break;
    case Status.Error:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.emoji}>
            ❌
          </div>
          <div>Error processing transaction</div>
        </div>
      );
      break;
    case Status.Idle:
      modalContent = createAuctionForm
      break;
    case Status.TransactionApproved:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.spinner}>
          <NextImage
            src="/loader.svg"
            alt="Conference Logo"
            layout="fill"
          />
          </div>
          <div>☑️ Transaction approved!</div>
          <div>Waiting for transaction to be processed in Celo blockchain...</div>
        </div>
      );
      break;
    case Status.Success:
      modalContent = (
        <div className={styles.updateContainer}>
          <div className={styles.emoji}>
          👏
          </div>
          <div>Auction created!</div>
        </div>
      );
      break;
    default:
      break;
  }

  const disabledButton = creationStatus !== Status.Idle;
  return (
    <div className={styles.container}>
      <button className={styles.createAuctionButton} onClick={openModal}>Create auction</button>
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
            <button onClick={onCreateClick} disabled={disabledButton}>Create auction</button>
            <button onClick={closeModal}>close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

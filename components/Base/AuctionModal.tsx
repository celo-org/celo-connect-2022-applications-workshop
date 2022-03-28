import { randomBytes } from "crypto";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import isURL from "validator/lib/isURL";
import styles from "./AuctionModal.module.css";

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

export default function AuctionModal({
  createAuction,
}: {
  createAuction: (imageUrl: string, bidTime: number) => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [bidTime, setBidTime] = useState(5);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!modalIsOpen) return;
    setImageUrl("https://robohash.org/" + randomBytes(16).toString("hex"));
  }, [modalIsOpen]);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const onCreateClick = useCallback(
    () => createAuction(imageUrl, bidTime).then(closeModal),
    [createAuction, imageUrl, bidTime, closeModal]
  );

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
          <div>
            <div className={styles.inputSection}>
              <label htmlFor="url">Image URL to be auctioned</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value.trim())}
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
            {isURL(imageUrl) && (
              <img src={imageUrl} alt="image to be auctioned" />
            )}
          </div>
          <div className={styles.buttonSection}>
            <button onClick={onCreateClick}>Create auction</button>
            <button onClick={closeModal}>close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

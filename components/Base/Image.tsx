/* eslint-disable @next/next/no-img-element */
import stylesCard from "./Image.module.css";
import PlaceholderSvg from "./PlaceholderSvg";

export default function Img({ url }: { url: string }) {
  return (
    <div className={stylesCard.imageContainer}>
      {!url ? (
        <PlaceholderSvg />
      ) : (
        <img src={url} alt="Artwork for auction" width={400} height={400} />
      )}
    </div>
  );
}

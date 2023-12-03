import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Box } from "@mui/material";
import { useState } from "react";

const UserImage = ({ image, size = "60px" }) => {
  const [open, setOpen] = useState(false);

  const openLightbox = () => {
    setOpen(true);
  };

  const closeLightbox = () => {
    setOpen(false);
  };

  const slides = [
    {
      src: `http://localhost:3001/assets/${image}`,
      alt: "user",
      width: 3840,
      height: 2560,
    },
    // Add more slides if you have multiple images
  ];

  return (
    <>
      <Box width={size} height={size}>
        <img
          style={{
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          width={size}
          height={size}
          alt="user"
          src={`http://localhost:3001/assets/${image}`}
          onClick={openLightbox}
        />
      </Box>

      <Lightbox
        open={open}
        close={closeLightbox}
        carousel={{ finite: slides.length <= 1 }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
        slides={slides}
      />
    </>
  );
};

export default UserImage;

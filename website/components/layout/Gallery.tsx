import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

export type GalleryProps = {
  images: { original: string, thumbnail: string }[]
}

const Gallery = (props: GalleryProps) => {
  return <ImageGallery items={props.images} />;
}

export default Gallery;

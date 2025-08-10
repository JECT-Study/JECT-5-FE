import { createContext, useContext } from 'react';

export interface ImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  src: string | any;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImageComponent = React.ComponentType<any>;

const ImageContext = createContext<ImageComponent | null>(null);

export const ImageProvider = ({ 
  children, 
  component 
}: { 
  children: React.ReactNode; 
  component: ImageComponent;
}) => (
  <ImageContext.Provider value={component}>
    {children}
  </ImageContext.Provider>
);

export const Image = (props: ImageProps) => {
  const ImageComponent = useContext(ImageContext);
  
  if (!ImageComponent) {
    const { width, height, priority, fill, sizes, quality, placeholder, blurDataURL, ...imgProps } = props;
    return <img {...imgProps} src={typeof props.src === 'string' ? props.src : props.src?.src || props.src} />;
  }
  
  return <ImageComponent {...props} />;
};
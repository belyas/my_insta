import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface AvatarCropperProps {
  image: string | File;
  onCrop: (cropped: string) => void;
  onCancel: () => void;
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({ image, onCrop, onCancel }) => {
  const editorRef = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1);

  const handleCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      onCrop(canvas.toDataURL());
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <AvatarEditor
        ref={editorRef}
        image={image}
        width={200}
        height={200}
        border={50}
        borderRadius={100}
        color={[255, 255, 255, 0.6]}
        scale={scale}
        rotate={0}
      />
      <input
        type="range"
        min="1"
        max="3"
        step="0.01"
        value={scale}
        onChange={e => setScale(parseFloat(e.target.value))}
      />
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleCrop}>Crop</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AvatarCropper;

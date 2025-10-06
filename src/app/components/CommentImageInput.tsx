"use client";
import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';

interface CommentImageInputProps {
  onImageSelect: (imageDataUrl: string) => void;
}

const CommentImageInput: React.FC<CommentImageInputProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={<ImageIcon />}
        onClick={() => fileInputRef.current?.click()}
      >
        Image
      </Button>
      {preview && (
        <img src={preview} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
      )}
    </Box>
  );
};

export default CommentImageInput;

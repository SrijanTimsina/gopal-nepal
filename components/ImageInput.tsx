import React from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageInputProps {
  label?: string;
  className?: string;
  props?: Record<string, unknown>;
  setValue: (value: string) => void;
  defaultValue?: string | null;
}

export default function ImageInput({
  label,
  className = '',
  props,
  setValue,
  defaultValue = '',
}: ImageInputProps) {
  const [image, setImage] = React.useState<string | null>(defaultValue);

  return (
    <div className="mb-8 w-full">
      <div className="mb-1 flex items-center justify-between gap-2">
        {label && <p className="ml-1 text-xs text-gray-500">{label}</p>}
        {image && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setImage('');
              setValue('');
            }}
          >
            Remove Image
          </Button>
        )}
      </div>
      <div className="relative h-full w-full">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setImage(res[0].key);
            setValue(res[0].key);
          }}
          onUploadError={(error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className={`m-0 h-full w-full ${className}`}
          {...props}
        />
        {image && (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center border bg-white">
            <Image
              src={`https://utfs.io/f/${image}`}
              alt={label || 'Uploaded Image'}
              width={300}
              height={300}
              className="h-full w-full bg-white object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

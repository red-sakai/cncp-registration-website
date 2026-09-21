"use client";

import React, { useState, useRef, useTransition, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, Image as ImageIcon, Upload, Crop } from "lucide-react";
import {
  updateEventDetailsAction,
  uploadEventImageAction,
} from "@/actions/eventActions";
import { getCroppedImg } from "@/lib/utils/cropImage";

interface CoverImageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  slug: string;
}

type Step = "preview" | "crop";

export function CoverImageChangeModal({
  isOpen,
  onClose,
  currentImage,
  slug,
}: CoverImageChangeModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    currentImage || "",
  );
  const [step, setStep] = useState<Step>("preview");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);
  const originalImageRef = useRef<string>("");

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileRef.current = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        originalImageRef.current = dataUrl;
        setSelectedImage(dataUrl);
        setStep("crop");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (step === "preview") {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setSelectedImage("");
    fileRef.current = null;
    originalImageRef.current = "";
    setStep("preview");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !originalImageRef.current) return;

    try {
      const croppedBlob = await getCroppedImg(
        originalImageRef.current,
        croppedAreaPixels,
      );
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setSelectedImage(croppedUrl);
      setStep("preview");

      // Create a File from the blob so uploadEventImageAction can use it
      fileRef.current = new File([croppedBlob], "cropped-cover.jpg", {
        type: "image/jpeg",
      });
    } catch (error) {
      console.error("Failed to crop image:", error);
      alert("Failed to crop image");
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        let imageUrl = selectedImage;

        if (fileRef.current) {
          const formData = new FormData();
          formData.append("file", fileRef.current);
          const uploadResult = await uploadEventImageAction(formData);

          if (
            !uploadResult ||
            !uploadResult.success ||
            !uploadResult.data?.url
          ) {
            throw new Error("Failed to upload image to storage");
          }

          imageUrl = uploadResult.data.url;
        }

        const result = await updateEventDetailsAction({
          slug,
          coverImage: imageUrl,
        });

        if (!result || (result && !result.success)) {
          throw new Error("Failed to save via Server Action");
        }

        alert("Cover image updated successfully!");
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error updating cover image:", error);
        alert("Failed to update cover image");
      }
    });
  };

  const handleCancel = () => {
    if (step === "crop") {
      setStep("preview");
      return;
    }
    setSelectedImage(currentImage || "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#0a0015] to-[#0d1137] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-urbanist text-xl md:text-2xl font-bold text-white">
            {step === "crop" ? "Crop Cover Photo" : "Change Cover Photo"}
          </h2>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isPending}
          />

          {step === "crop" && originalImageRef.current ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/50">
                <Cropper
                  image={originalImageRef.current}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 accent-violet-500"
                />
              </div>
              <p className="text-xs text-white/40 text-center">
                Drag to position, scroll or use the slider to zoom. The image
                will be cropped to a square.
              </p>
            </div>
          ) : (
            <div
              onClick={handleClick}
              className="aspect-[16/9] w-full rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-violet-500/50 transition-all"
            >
              {selectedImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Cover Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold text-lg">
                      Click to change
                    </p>
                  </div>
                  {!isPending && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors z-10"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center p-8 relative z-10">
                  <div className="bg-white/5 p-4 rounded-full mb-4 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-white/50 group-hover:text-violet-500 transition-colors" />
                  </div>
                  <p className="text-lg font-bold text-white mb-2">
                    Upload Cover Image
                  </p>
                  <p className="text-sm text-white/60 mb-3">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-white/40">
                    Recommended: 1920x1080px (16:9 ratio)
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "preview" && selectedImage && (
            <p className="text-sm text-white/60 mt-4 text-center">
              Click the image to upload a different photo
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="font-urbanist px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors"
          >
            {step === "crop" ? "Back" : "Cancel"}
          </button>

          {step === "crop" ? (
            <button
              onClick={handleCropConfirm}
              disabled={isPending}
              className="font-urbanist px-6 py-2.5 bg-violet-600 hover:bg-cyan-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Crop size={16} />
              Crop
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isPending || !selectedImage}
              className="font-urbanist px-6 py-2.5 bg-violet-600 hover:bg-cyan-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Save Cover Photo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

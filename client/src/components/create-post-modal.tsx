import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/lib/dummy-data";
import { 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Smile, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { direction } = useLanguage();
  const [caption, setCaption] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = direction === "rtl";

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    if (currentImageIndex >= selectedImages.length - 1) {
      setCurrentImageIndex(Math.max(0, selectedImages.length - 2));
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onOpenChange(false);
    // Reset form
    setCaption("");
    setSelectedImages([]);
    setLocation("");
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
    );
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        multiple
        onChange={handleImageSelect}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-border">
            <DialogTitle className="text-center font-semibold">
              {isRTL ? "إنشاء منشور جديد" : "Create new post"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col max-h-[80vh]">
            {/* Image Preview Section */}
            {selectedImages.length > 0 && (
              <div className="relative bg-muted aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImages[currentImageIndex]}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />

                {/* Image Counter */}
                {selectedImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {selectedImages.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Remove Image Button */}
                <button
                  onClick={() => removeImage(currentImageIndex)}
                  className="absolute top-4 left-4 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image Dots Indicator */}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          index === currentImageIndex
                            ? "bg-primary w-3"
                            : "bg-white/60 hover:bg-white/80"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State - Select Images */}
            {selectedImages.length === 0 && (
              <div className="aspect-square flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-border">
                <ImageIcon className="w-20 h-20 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  {isRTL
                    ? "اسحب الصور هنا أو انقر للتحديد"
                    : "Drag photos here or click to select"}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  {isRTL ? "اختر من جهازك" : "Select from computer"}
                </Button>
              </div>
            )}

            {/* Caption and Details Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{currentUser.username}</span>
                </div>

                {/* Caption Input */}
                <Textarea
                  placeholder={
                    isRTL ? "اكتب تعليقاً..." : "Write a caption..."
                  }
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-base p-0"
                  dir={direction}
                  maxLength={2200}
                />

                {/* Character Count */}
                <div className="text-xs text-muted-foreground text-right">
                  {caption.length} / 2,200
                </div>

                {/* Add More Photos Button */}
                {selectedImages.length > 0 && selectedImages.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {isRTL
                      ? `إضافة المزيد من الصور (${selectedImages.length}/10)`
                      : `Add more photos (${selectedImages.length}/10)`}
                  </Button>
                )}

                {/* Location Input */}
                <div className="flex items-center gap-2 border-t border-border pt-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={isRTL ? "أضف موقعاً" : "Add location"}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent border-0 outline-none text-sm"
                    dir={direction}
                  />
                </div>

                {/* Emoji Picker Button */}
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Smile className="w-5 h-5" />
                  <span className="text-sm">
                    {isRTL ? "أضف رموز تعبيرية" : "Add emoji"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer - Share Button */}
            <div className="border-t border-border p-4">
              <Button
                onClick={handlePost}
                disabled={
                  selectedImages.length === 0 || isLoading
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isRTL ? "جاري النشر..." : "Posting..."}
                  </>
                ) : (
                  isRTL ? "نشر" : "Share"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

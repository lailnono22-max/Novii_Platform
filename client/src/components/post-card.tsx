import { Post } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VerifiedBadge } from "@/components/ui/verified-badge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isDoubleTapLiked, setIsDoubleTapLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
        setLikeCount(prev => prev - 1);
    } else {
        setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleDoubleTap = () => {
      if (!liked) {
          setLiked(true);
          setLikeCount(prev => prev + 1);
      }
      setIsDoubleTapLiked(true);
      setTimeout(() => setIsDoubleTapLiked(false), 1000);
  };

  return (
    <div className="flex flex-col w-full bg-card border-b border-border md:border md:rounded-3xl overflow-hidden mb-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={post.user.avatar} alt={post.user.username} />
            <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm cursor-pointer hover:text-primary transition-colors">{post.user.username}</span>
              {post.user.verified && <VerifiedBadge size="sm" />}
            </div>
            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Image */}
      <div 
        className="relative w-full aspect-square md:aspect-[4/5] bg-muted overflow-hidden cursor-pointer group"
        onDoubleClick={handleDoubleTap}
      >
        <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
        />
        
        {/* Heart Animation Overlay */}
        <div className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
            isDoubleTapLiked ? "opacity-100" : "opacity-0"
        )}>
            <Heart className="w-24 h-24 text-white fill-white animate-bounce drop-shadow-2xl" />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={handleLike}
                className="group focus:outline-none"
                data-testid={`button-like-${post.id}`}
            >
                <Heart className={cn(
                    "w-7 h-7 transition-all duration-200 group-active:scale-75",
                    liked ? "fill-destructive text-destructive" : "text-foreground hover:text-muted-foreground"
                )} />
            </button>
            
            <button className="group focus:outline-none hover:text-muted-foreground transition-colors">
                <MessageCircle className="w-7 h-7 -rotate-90" />
            </button>

            <button className="group focus:outline-none hover:text-muted-foreground transition-colors">
                <Share2 className="w-7 h-7" />
            </button>
        </div>

        <button className="group focus:outline-none hover:text-muted-foreground transition-colors">
            <Bookmark className="w-7 h-7" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 space-y-2">
        <div className="font-bold text-sm">{likeCount.toLocaleString()} likes</div>
        <div className="text-sm">
            <span className="inline-flex items-center gap-1 font-bold mr-2">
              {post.user.username}
              {post.user.verified && <VerifiedBadge size="sm" />}
            </span>
            <span className="text-foreground/90 leading-relaxed">{post.caption}</span>
        </div>
        {post.comments > 0 && (
            <div className="text-muted-foreground text-sm font-medium cursor-pointer hover:text-foreground transition-colors">
                View all {post.comments} comments
            </div>
        )}
      </div>
    </div>
  );
}

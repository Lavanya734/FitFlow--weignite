import { Heart, MessageCircle, Share2, Music2, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { dummyReels } from "../../data/dummyReels";

const ReelsPage = () => {
  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {dummyReels.map((reel) => (
        <div 
          key={reel.id} 
          className="h-screen w-full relative flex items-center justify-center snap-start bg-black"
        >
          {/* 1. The Video Player */}
          <div className="relative h-full w-full max-w-[450px] aspect-[9/16] bg-slate-900 overflow-hidden shadow-2xl">
            <video
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* 2. Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            {/* 3. Right Side Actions */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md group-hover:bg-red-500 transition-colors">
                  <Heart className="text-white" fill="currentColor" size={24} />
                </div>
                <span className="text-white text-xs mt-1 font-medium">{reel.likes}</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md group-hover:bg-primary transition-colors">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <span className="text-white text-xs mt-1 font-medium">{reel.comments}</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                  <Share2 className="text-white" size={24} />
                </div>
                <span className="text-white text-xs mt-1 font-medium">Share</span>
              </div>

              <button className="text-white">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* 4. Bottom Info Section */}
            <div className="absolute bottom-6 left-4 right-16 text-white z-20">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={reel.userAvatar} />
                  <AvatarFallback>{reel.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">@{reel.username}</span>
                  <button className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 rounded-full w-fit">
                    Follow
                  </button>
                </div>
              </div>
              
              <p className="text-sm line-clamp-2 mb-3 leading-relaxed">
                {reel.caption}
              </p>

              <div className="flex items-center gap-2 text-xs opacity-80">
                <Music2 size={12} className="animate-spin-slow" />
                <span className="truncate">Original Audio - {reel.username}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsPage;
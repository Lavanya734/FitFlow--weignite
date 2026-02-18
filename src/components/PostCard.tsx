import { useState } from "react";
import { Heart, MessageCircle, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { CommunityPost } from "../data/dummyPosts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";


interface PostCardProps {
    post: CommunityPost;
}

const PostCard = ({ post }: PostCardProps) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [commneted, setCommented] = useState(false);
    const [commentCount, setCommentCount] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [following, setFollowing] = useState(false);

    const handleLike = () => {
        if (liked) {
            setLikeCount((prev) => prev - 1);
        } else {
            setLikeCount((prev) => prev + 1);
        }
        setLiked(!liked);
    };
    const handleComment = () => {
        if (commneted) {
            setCommentCount((prev) => prev - 1);
        } else {
            setCommentCount((prev) => prev + 1);
        }
        setCommented(!commneted);
    };

    const handleDoubleClick = () => {
        if (!liked) handleLike();
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState([
        { id: 1, user: "fit_girl", text: "This is fire 🔥" },
        { id: 2, user: "gymbro", text: "Crazy progress!" },
    ]);

        return (
  <>
    <Card className="rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">
                {post.user.name}
              </span>
              {post.user.isTrainer && (
                <BadgeCheck className="h-4 w-4 text-blue-500" />
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              @{post.user.username}
            </span>
          </div>
        </div>

        <button
          onClick={() => setFollowing(!following)}
          className="text-xs font-semibold text-primary hover:opacity-70 transition"
        >
          {following ? "Following" : "Follow"}
        </button>
      </CardHeader>

      {/* Image */}
      <div className="relative" onDoubleClick={handleDoubleClick}>
        <img
          src={post.image}
          alt="post"
          className="w-full max-h-[420px] object-cover"
        />

        {showHeart && (
          <Heart className="absolute inset-0 m-auto h-24 w-24 text-white fill-white opacity-80 animate-ping" />
        )}
      </div>

      {/* Actions */}
      <CardContent className="space-y-2 pt-3">

        <p className="text-sm">
          <span className="font-semibold mr-1">
            {post.user.username}
          </span>
          {post.caption}
        </p>

        <p className="text-xs text-muted-foreground">
          {post.createdAt}
        </p>

        <div className="flex items-center gap-4">
          <Heart
            onClick={handleLike}
            className={`h-6 w-6 cursor-pointer transition ${
              liked
                ? "text-red-500 fill-red-500 scale-110"
                : "hover:scale-110 hover:text-red-400"
            }`}
          />

          <MessageCircle
            onClick={() => setCommentsOpen(true)}
            className="h-6 w-6 cursor-pointer hover:scale-110 transition"
          />
        </div>
        <div className="flex items-center gap-4">
        <p className="text-sm font-semibold">{likeCount}</p>
        <p className="text-sm font-semibold">{commentCount}</p>
        </div>
      </CardContent>
    </Card>

    {/* COMMENTS MODAL */}
    <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto space-y-4 py-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{c.user[0]}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold text-sm mr-2">{c.user}</span>
                <span className="text-sm text-muted-foreground">
                  {c.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t pt-3">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => {
              if (!commentInput.trim()) return;
              setComments([
                ...comments,
                {
                  id: comments.length + 1,
                  user: "you",
                  text: commentInput,
                },
              ]);
              setCommentInput("");
            }}
            className="text-primary text-sm font-semibold"
          >
            Post
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </>
);
};



export default PostCard;
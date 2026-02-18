import { useState } from "react";
import PostCard from "../../components/Postcard";
import { dummyPosts, CommunityPost } from "../../data/dummyPosts";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import ReelsPage from "./ReelsPage";

const categories = ["All", "Workout", "Tip", "Transformation"];

const CommunityPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openModal, setOpenModal] = useState(false);

  const filteredPosts =
    activeCategory === "All"
      ? dummyPosts
      : dummyPosts.filter(
        (post: CommunityPost) => post.category === activeCategory
      );


  return (
    <div className="min-h-screen bg-background">

      {/* FULL WIDTH  NAVBAR */}
      <div className=" top-0 z-50 w-full bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold mb-4">
            Community
          </h1>

          {/* Category Tabs */}
          <Tabs defaultValue="All">
            <TabsList className="grid grid-cols-4 bg-primary/10">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="
    transition-all duration-300 ease-out
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    data-[state=active]:shadow-lg
  "
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/*  MAIN CONTENT BELOW NAVBAR */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-12">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col w-16 pt-4 space-y-6 sticky top-20 border-r border-border py-2">

          <Link to="/community" className="flex flex-col items-center text-xs text-muted-foreground hover:bg-card rounded-lg py-2">
            <img height={20} width={20} src="src/assets/feed_icn.svg" alt="Feed" />
            <span className="mt-1">Feed</span>
          </Link >


          <Link to="/community/reels" className="flex flex-col items-center text-xs text-muted-foreground hover:bg-card rounded-lg py-2">
            <img height={20} width={20} src="src/assets/reel_icn.svg" alt="Reels" />
            <span className="mt-1">Reels</span>
          </Link >


          <Link to="/community/search" className="flex flex-col items-center text-xs text-muted-foreground hover:bg-card rounded-lg py-2">
            <img height={20} width={20} src="src/assets/search_icn.png" alt="Search" />
            <span className="mt-1">Search</span>
          </Link >

          <Link to="/community/profile" className="flex flex-col items-center text-xs text-muted-foreground hover:bg-card rounded-lg py-2">
            <img height={20} width={20} src="src/assets/profile_icn.png" alt="Profile" />
            <span className="mt-1">Profile</span>
          </Link >



        </div>

        {/* LEFT FEED (70%) */}
        <div className="w-full max-w-md space-y-6">


          {/* Stories Row */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
            {/* Added pt-2 and pb-4 to prevent ring clipping */}
            {dummyPosts.slice(0, 6).map((post) => (
              <div key={`story-${post.id}`} className="flex flex-col items-center flex-shrink-0">
                {/* Added flex-shrink-0 so they don't squish */}
                <div className="p-0.5 rounded-full ring-2 ring-primary/50">
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>
                      {post.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="mt-1 truncate w-16 text-center text-[10px] text-muted-foreground">
                  {post.user.name.split(' ')[0]}
                  {/* Using split just to show the first name, looks cleaner in stories */}
                </span>
              </div>
            ))}
          </div>



          {/* Feed */}
          <div className="w-full max-w-md space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (30%) */}
        <div className="hidden lg:block w-80 space-y-6">

          <div className="border rounded-2xl p-5 space-y-4 bg-muted/40">
            <h2 className="font-semibold text-sm text-primary">
              Suggested Trainers
            </h2>

            {dummyPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>
                      {post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {post.user.name}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 bg-primary text-white rounded-full w-14 h-14 text-2xl shadow-xl hover:scale-110 transition"
      >
        +
      </button>

      {/* Create Post Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input type="file" accept="image/*" />
            <Input placeholder="Write a caption..." />
            <Button className="w-full rounded-full">
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityPage;
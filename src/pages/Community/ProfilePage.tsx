


import { useState } from "react";
import { dummyPosts } from "../../data/dummyPosts";
import PostCard from "../../components/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Grid3X3, List, MapPin, Link as LinkIcon, Calendar } from "lucide-react";

const ProfilePage = () => {
  // Filtering for a specific user from your dummy data
  const username = "fit_rahul"; 
  const userPosts = dummyPosts.filter((post) => post.user.username === username);
  const user = userPosts[0]?.user;

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Header Section with Cover Gradient */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-12 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Profile Picture */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-background shadow-xl">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{user?.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                {user?.isTrainer && (
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Pro Trainer
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">@{user?.username}</p>
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            <Button variant="outline" size="sm" className="rounded-full px-6">Edit Profile</Button>
            <Button size="sm" className="rounded-full px-6 shadow-md">Share</Button>
          </div>
        </div>

        {/* 2. Bio & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm leading-relaxed max-w-lg">
              Fitness enthusiast & certified coach. Specializing in high-intensity 
              strength training and functional movement. Helping you build the best 
              version of yourself. 💪🔥
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><MapPin size={14} /> Mumbai, India</div>
              <div className="flex items-center gap-1 text-primary"><LinkIcon size={14} /> linktr.ee/fit_rahul</div>
              <div className="flex items-center gap-1"><Calendar size={14} /> Joined Jan 2024</div>
            </div>
          </div>

          <div className="flex justify-between md:justify-around border-y md:border-none py-4 md:py-0">
            <div className="text-center">
              <p className="font-bold text-lg">{userPosts.length}</p>
              <p className="text-xs text-muted-foreground uppercase">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">1.2k</p>
              <p className="text-xs text-muted-foreground uppercase">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">482</p>
              <p className="text-xs text-muted-foreground uppercase">Following</p>
            </div>
          </div>
        </div>

        {/* 3. Content Tabs */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 gap-8">
            <TabsTrigger value="grid" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-2 h-full flex gap-2">
              <Grid3X3 size={16} /> <span className="text-sm">Grid</span>
            </TabsTrigger>
            <TabsTrigger value="feed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-2 h-full flex gap-2">
              <List size={16} /> <span className="text-sm">Feed</span>
            </TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {userPosts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-md border bg-muted">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-1 font-bold">❤️ {post.likes}</div>
                    <div className="flex items-center gap-1 font-bold">💬 {post.comments}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Feed View */}
          <TabsContent value="feed" className="mt-6 flex flex-col items-center gap-6">
            {userPosts.map((post) => (
              <div key={post.id} className="w-full max-w-xl">
                <PostCard post={post} />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
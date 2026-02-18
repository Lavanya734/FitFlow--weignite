// import { useState } from "react";
// import { Input } from "../../components/ui/input";
// import { dummyPosts } from "../../data/dummyPosts";
// import PostCard from "../../components/Postcard";

// const SearchPage = () => {
//   const [query, setQuery] = useState("");

//   const filtered = dummyPosts.filter((post) =>
//     post.user.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Search</h1>

//       <Input
//         placeholder="Search users..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         className="mb-6"
//       />

//       <div className="space-y-6">
//         {filtered.map((post) => (
//           <PostCard key={post.id} post={post} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { dummyPosts } from "../../data/dummyPosts";
import PostCard from "../../components/Postcard";
import { Search, TrendingUp, Users, Image as ImageIcon, X } from "lucide-react";
import { Badge } from "../../components/ui/badge";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "people" | "posts">("all");

  const trendingTags = ["WeightLoss", "YogaFlow", "HighProtein", "MarathonPrep", "SquatPR"];

  const filteredPosts = dummyPosts.filter((post) => {
    const matchesQuery = 
      post.user.name.toLowerCase().includes(query.toLowerCase()) ||
      post.caption.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase());
    
    if (activeTab === "people") return matchesQuery && post.user.name.toLowerCase().includes(query.toLowerCase());
    if (activeTab === "posts") return matchesQuery && post.caption.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Sticky Search Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search trainers, workouts, or tips..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All", icon: <TrendingUp size={14} /> },
              { id: "people", label: "Profiles", icon: <Users size={14} /> },
              { id: "posts", label: "Posts", icon: <ImageIcon size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 mt-2">
        {/* 2. Discovery State (When no query) */}
        {!query && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Trending Section */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp size={16} className="text-primary" /> Trending Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-4 py-1.5 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Explore Grid */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Explore Community</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dummyPosts.map((post) => (
                  <div key={`explore-${post.id}`} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer">
                    <img 
                      src={post.image} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute bottom-2 left-2 text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      @{post.user.username}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 3. Search Results State */}
        {query && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-sm">Found {filteredPosts.length} results for "{query}"</p>
            </div>
            
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-20 space-y-3">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No results found</h3>
                <p className="text-muted-foreground text-sm">Try searching for "Workout", "Yoga", or a trainer's name.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
import Layout from "@/components/layout";
import { currentUser, posts } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Settings, Grid3X3, Bookmark, UserSquare2, Heart, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerifiedBadge } from "@/components/ui/verified-badge";

export default function Profile() {
  // Get posts belonging to the user (mock filter)
  const myPosts = posts.filter(p => p.user.id === currentUser.id || p.likedByMe); 

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-background">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 p-6 md:py-10 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
            
            {/* Avatar */}
            <div className="relative group">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 border-2 border-border group-hover:border-primary transition-colors duration-300">
                    <img 
                        src={currentUser.avatar} 
                        alt={currentUser.username} 
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-display font-bold">{currentUser.username}</h1>
                      {currentUser.verified && <VerifiedBadge size="lg" />}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="h-8 px-4 font-semibold rounded-lg">Edit Profile</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="w-5 h-5" /></Button>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-10 text-sm md:text-base">
                    <div className="flex flex-col md:flex-row gap-1 items-center md:items-baseline">
                        <span className="font-bold text-foreground">{currentUser.postsCount}</span>
                        <span className="text-muted-foreground">posts</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 items-center md:items-baseline">
                        <span className="font-bold text-foreground">{currentUser.followers}</span>
                        <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 items-center md:items-baseline">
                        <span className="font-bold text-foreground">{currentUser.following}</span>
                        <span className="text-muted-foreground">following</span>
                    </div>
                </div>

                <div className="max-w-md space-y-1">
                    <div className="font-bold text-md">{currentUser.name}</div>
                    <div className="text-sm whitespace-pre-line leading-relaxed text-muted-foreground md:text-foreground">{currentUser.bio}</div>
                </div>
            </div>
        </div>

        {/* Tabs & Grid */}
        <div className="flex-1 border-t border-border mt-2">
            <Tabs defaultValue="posts" className="w-full">
                <div className="flex justify-center border-b border-border">
                    <TabsList className="h-12 bg-transparent gap-8">
                        <TabsTrigger value="posts" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground px-4 gap-2 uppercase text-xs tracking-widest font-bold bg-transparent shadow-none">
                            <Grid3X3 className="w-4 h-4" /> POSTS
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground px-4 gap-2 uppercase text-xs tracking-widest font-bold bg-transparent shadow-none">
                            <Bookmark className="w-4 h-4" /> SAVED
                        </TabsTrigger>
                        <TabsTrigger value="tagged" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground px-4 gap-2 uppercase text-xs tracking-widest font-bold bg-transparent shadow-none">
                            <UserSquare2 className="w-4 h-4" /> TAGGED
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="posts" className="p-1 md:p-4 max-w-4xl mx-auto mt-0">
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                        {/* Mocking more posts for the grid effect */}
                        {[...myPosts, ...posts, ...posts].map((post, i) => (
                            <div key={`${post.id}-${i}`} className="relative aspect-square group cursor-pointer overflow-hidden bg-muted">
                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Post" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-bold">
                                    <div className="flex items-center gap-1"><Heart className="w-5 h-5 fill-white" /> {post.likes}</div>
                                    <div className="flex items-center gap-1"><MessageCircle className="w-5 h-5 fill-white" /> {post.comments}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>

      </div>
    </Layout>
  );
}

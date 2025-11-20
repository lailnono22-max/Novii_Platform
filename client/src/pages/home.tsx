import Layout from "@/components/layout";
import StoryBar from "@/components/story-bar";
import PostCard from "@/components/post-card";
import { currentUser, posts, stories } from "@/lib/dummy-data";

export default function Home() {
  return (
    <Layout>
      {/* Restrict width for Home Feed to standard size */}
      <div className="flex flex-col gap-2 md:gap-6 md:pt-6 w-full max-w-[630px] mx-auto">
        <StoryBar stories={stories} currentUserAvatar={currentUser.avatar} />
        
        <div className="flex flex-col items-center w-full">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
      </div>
    </Layout>
  );
}

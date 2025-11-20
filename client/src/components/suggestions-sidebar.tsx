import { User } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mock suggestions data
const suggestions = [
  { id: 's1', username: 'youssef_ashraf', name: 'Youssef Ashraf', avatar: '', subtitle: 'Suggested for you' },
  { id: 's2', username: 'hesham_wahby', name: 'Hesham Wahby', avatar: '', subtitle: 'Followed by mhmd_taheer' },
  { id: 's3', username: 'yousef_joe', name: 'Yousef', avatar: '', subtitle: 'Followed by abdullah_boda111' },
  { id: 's4', username: 'abdalla_abass', name: 'Abdalla Abass', avatar: '', subtitle: 'Followed by ahmad.elsabbah + 2' },
  { id: 's5', username: 'omar_abdel_latif', name: 'Omar AbdEl Latif', avatar: '', subtitle: 'Followed by mhmd9392nsr + 1' },
];

export default function SuggestionsSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 p-6 pt-10 z-40">
      {/* User Profile Snippet (Optional, usually at top) */}
      
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-muted-foreground text-sm">Suggestions for you</span>
        <button className="text-xs font-bold hover:text-muted-foreground">See All</button>
      </div>

      <div className="flex flex-col gap-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">{user.username}</span>
                <span className="text-xs text-muted-foreground mt-1 truncate w-32">{user.subtitle}</span>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-primary/80">Follow</button>
          </div>
        ))}
      </div>

      <div className="mt-auto text-xs text-muted-foreground/50 space-y-2">
        <p>About • Help • Press • API • Jobs • Privacy • Terms</p>
        <p>© 2025 NOVII FROM REPLIT</p>
      </div>
    </aside>
  );
}

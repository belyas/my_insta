"use client";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PostCard from "./PostCard";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useSearchStore } from "../store/searchStore";

export default function SearchPosts({ q }: { q: string }) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = React.useState<string | null>(null);
  const { profiles, fetchProfile } = useProfileStore();
  const { search, results: posts } = useSearchStore();

  useEffect(() => {
    if (!q) return;
    setLoading(true);

    search(q).then(() => {
      setLoading(false);
    });
  }, [q]);

  useEffect(() => {
    const missing = Array.from(new Set(posts.map(p => p.username))).filter(u => u && !profiles[u]);
    missing.forEach(u => fetchProfile(u));
  }, [posts, profiles, fetchProfile]);

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, width: user ? 700 : 600, maxWidth: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {q.startsWith('#') ? `Posts with ${q}` : q ? `Posts by @${q}` : 'Search Posts'}
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {posts.map((post) => (
            <ListItem key={post.id} alignItems="flex-start" sx={{ p: 0, mb: 4, justifyContent: 'center' }}>
              <PostCard
                post={post}
                user={user}
                menuAnchorEl={menuAnchorEl}
                setMenuAnchorEl={setMenuAnchorEl}
                menuPostId={menuPostId}
                setMenuPostId={setMenuPostId}
                profiles={profiles}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

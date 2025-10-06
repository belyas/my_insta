"use client";
import React, { useEffect, useState } from "react";
import { fetchPostsByHashtag } from "../services/searchService";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PostCard from "./PostCard";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";

export default function HashtagSearchPage({ hashtag }: { hashtag: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = React.useState<string | null>(null);
  const { profiles, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!hashtag) return;
    setLoading(true);
    fetchPostsByHashtag(hashtag).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [hashtag]);

  useEffect(() => {
    const missing = Array.from(new Set(posts.map(p => p.username))).filter(u => u && !profiles[u]);
    missing.forEach(u => fetchProfile(u));
  }, [posts, profiles, fetchProfile]);

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, width: user ? 700 : 600, maxWidth: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Posts with #{hashtag}
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

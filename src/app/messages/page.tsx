"use client";
import React, { useState } from 'react';
import Conversations from '../components/Conversations';
import Messages from '../components/Messaging';
import MessageForm from '../components/MessageForm';
// import MessagingAdvanced from '../components/MessagingAdvanced';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const MessagesPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Box component={Paper} elevation={3} sx={{ flex: 1, overflowY: 'auto' }}>
        <Conversations onSelect={setSelectedConversationId} />
      </Box>

      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {selectedConversationId ? (
            <Messages conversationId={selectedConversationId} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <p>Select a conversation to start messaging</p>
            </Box>
          )}
        </Box>
        <Box sx={{ borderTop: '1px solid #ccc' }}>
          {selectedConversationId && <MessageForm conversationId={selectedConversationId} />}
        </Box>
      </Box>

      {/* <Box component={Paper} elevation={3} sx={{ flex: 1, overflowY: 'auto' }}>
        <MessagingAdvanced />
      </Box> */}
    </Box>
  );
};

export default MessagesPage;
import React from 'react';
import { useParams } from 'next/navigation';
import Messages from '../../components/Messaging';
import MessageForm from '../../components/MessageForm';

const ConversationPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Messages Section */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Messages conversationId={id} />
      </div>
      <div style={{ borderTop: '1px solid #ccc' }}>
        <MessageForm conversationId={id} />
      </div>
    </div>
  );
};

export default ConversationPage;
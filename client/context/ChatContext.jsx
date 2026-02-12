import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { createContext } from "react";

export const ChatContext = createContext();

// Provides chat-related state and actions across the application
export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);        // Messages for selected chat
  const [users, setUsers] = useState([]);              // Users list for sidebar
  const [selectedUser, setSelectedUser] = useState(null); // Currently active chat user
  const [unseenMessages, setUnseenMessages] = useState({}); // Unread message count per user

  const { socket, axios } = useContext(AuthContext);

  // Fetch users list and unseen message counts for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // Fetch chat messages for a selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // Send message to currently selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data.newMessage,
        ]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to real-time incoming messages
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {

      // If active chat is open, mark message as seen
      if (
        selectedUser &&
        newMessage.senderId === selectedUser._id
      ) {
        newMessage.seen = true;
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);

        axios.put(`/api/messages/mark/${newMessage._id}`);
      } 
      // Otherwise, increase unseen message count
      else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]:
            prevUnseenMessages[newMessage.senderId]
              ? prevUnseenMessages[newMessage.senderId] + 1
              : 1,
        }));
      }
    });
  };

  // Unsubscribe from message events
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // Manage socket subscriptions on mount and dependency change
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  // Expose chat state and actions
  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

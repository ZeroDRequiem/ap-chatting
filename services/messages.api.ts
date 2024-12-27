type Message = {
    id: string;
    username: string;
    text: string;
    chatroomId: string;
  };

  // Fetch messages for a specific chatroom
  export const fetchMessagesFromApi = async (chatroomId: string): Promise<Message[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
            { id: "1", username: "Alice", text: "Hello!", chatroomId: "1" },
            { id: "2", username: "Bob", text: "Hi there!", chatroomId: "1" },
          ]);
      }, 1000);
    });
  };
  
  // Send a message to a specific chatroom
  export const sendMessageToApi = async (chatroomId: string, message: Omit<Message, 'id'>): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          ...message,
          id: Date.now().toString(), // Generate a unique ID
          chatroomId,
        };
        resolve(newMessage);
      }, 500);
    });
  };
  
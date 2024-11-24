import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

// Define the type for chat messages
type ChatMessage = {
  user: string;
  text: string;
  time?: number;
};

const WebSocketChat = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [allChat, setAllChat] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [presence, setPresence] = useState("🔴");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080", ["json"]);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setPresence("🟢");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setPresence("🔴");
    };

    socket.onmessage = (event) => {
      const data: { msg: ChatMessage[] } = JSON.parse(event.data);
      setAllChat(data.msg);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const postNewMsg = () => {
    if (ws && user && message) {
      const data: ChatMessage = { user, text: message, time: Date.now() };
      ws.send(JSON.stringify(data));
      setMessage("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.chatContainer}>
          <FlatList
            data={allChat}
            keyExtractor={(item, index) => `${item.user}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.message}>{item.text}</Text>
              </View>
            )}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inputContainer}
        >
          <TextInput
            placeholder="Your Name"
            value={user}
            onChangeText={setUser}
            style={styles.input}
          />
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={postNewMsg}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    padding: 16,
    backgroundColor: "#6200EE",
    color: "#FFFFFF",
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  user: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#6200EE",
  },
  message: {
    fontSize: 16,
    color: "#333333",
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    marginBottom: Platform.select({ ios: 80 }),
  },
  input: {
    height: 44,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#FAFAFA",
  },
  sendButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WebSocketChat;

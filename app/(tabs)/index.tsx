import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
  View,
} from "react-native";

const WebSocketChat = () => {
  const [ws, setWs] = useState(null);
  const [allChat, setAllChat] = useState([]);
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
      const data = JSON.parse(event.data);
      setAllChat(data.msg);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const postNewMsg = () => {
    if (ws && user && message) {
      const data = { user, text: message };
      ws.send(JSON.stringify(data));
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.presenceIndicator}>{presence}</Text>
      <Text style={styles.title}>Chat with Me</Text>
      <FlatList
        data={allChat}
        keyExtractor={(item, index) => `${item.user}-${index}`}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={styles.user}>{item.user}: </Text>
            {item.text}
          </Text>
        )}
      />
      <TextInput
        placeholder="User Name"
        value={user}
        onChangeText={setUser}
        style={styles.input}
      />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />
      <Button title="Send" onPress={postNewMsg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  presenceIndicator: {
    fontSize: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    paddingVertical: 5,
  },
  user: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default WebSocketChat;

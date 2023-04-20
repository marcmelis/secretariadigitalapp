import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot', content: string }>>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', content: input }]);
      setInput('');
      setIsTyping(true); // Show typing indicator

      try {
        const response = await axios.post('https://secretariadigital.herokuapp.com/answer_query', {
          user_message: input,
        });
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', content: response.data.answer }]);
      } catch (error) {
        console.error('Error calling Flask API:', error);
      } finally {
        setIsTyping(false); // Hide typing indicator
      }
    }
  };



  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="EPS Secretaria Digital" />
        </Appbar.Header>

        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={{
                backgroundColor: message.sender === 'user' ? 'white' : '#830051',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Text style={{ color: message.sender === 'user' ? 'black' : 'white' }}>{message.content}</Text>
            </View>
          ))}
          {isTyping && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                alignSelf: 'flex-start',
              }}
            >
              <Text>Bot is typing</Text>
              <Text style={{ marginLeft: 5 }}>•••</Text>
            </View>
          )}
        </ScrollView>


        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            onChangeText={setInput}
            value={input}
            onSubmitEditing={handleSendMessage}
            placeholder="Type your message"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonIcon}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
     </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#E5DDD5',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderColor: '#E5DDD5',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#830051',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
  },
  sendButtonIcon: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;


import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const mockTires = [
  { id: '1', brand: ' 'BFGoodrich', type: 'All-Terrain', size: '275/60R20', price: '$220' },
  { id: '2', brand: 'Michelin', type: 'Highway', size: '275/60R20', price: '$250' },
  { id: '3', brand: 'Nitto', type: 'Mud Terrain', size: '275/60R20', price: '$210' },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState([]);
  const [answers, setAnswers] = useState({});
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', address: '', datetime: '' });

  const handleAnswer = (text) => {
    const keys = ['size', 'preference', 'terrain', 'quantity'];
    const key = keys[step];
    const newAnswers = { ...answers, [key]: text };
    setAnswers(newAnswers);
    setChat([...chat, { from: 'user', text }, { from: 'bot', text: nextQuestion(step + 1) }]);
    setStep(step + 1);
  };

  const nextQuestion = (step) => {
    const questions = [
      'What size tires are you looking for?',
      'Any brand, quality, or price preference?',
      'Do you need Mud, All-Terrain, or Highway tires?',
      'How many tires do you need?'
    ];
    return questions[step] || '';
  };

  const filteredTires = mockTires.filter(
    t => t.size === answers.size && t.type.toLowerCase().includes((answers.terrain || '').toLowerCase())
  );

  const submitRequest = (tire) => {
    setRequests([...requests, { ...form, tire, quantity: answers.quantity }]);
    setStep(6);
  };

  return (
    <ScrollView style={{ padding: 20, marginTop: 40 }}>
      {step <= 3 && (
        <>
          {chat.map((msg, i) => (
            <Text key={i} style={{ marginVertical: 4, color: msg.from === 'bot' ? 'blue' : 'black' }}>{msg.text}</Text>
          ))}
          <TextInput
            style={{ borderWidth: 1, padding: 8, marginTop: 10 }}
            placeholder="Type your answer..."
            onSubmitEditing={(e) => handleAnswer(e.nativeEvent.text)}
          />
        </>
      )}

      {step === 4 && (
        <>
          <Text style={{ fontWeight: 'bold' }}>Matching Tires:</Text>
          {filteredTires.map(t => (
            <TouchableOpacity key={t.id} onPress={() => setStep(5)} style={{ marginVertical: 10, padding: 10, borderWidth: 1 }}>
              <Text>{t.brand} - {t.type}</Text>
              <Text>{t.size} - {t.price}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 5 && (
        <>
          <Text style={{ fontWeight: 'bold' }}>Enter your details for install:</Text>
          <TextInput placeholder="Name" style={{ borderWidth: 1, marginVertical: 4 }} onChangeText={v => setForm({ ...form, name: v })} />
          <TextInput placeholder="Phone" style={{ borderWidth: 1, marginVertical: 4 }} onChangeText={v => setForm({ ...form, phone: v })} />
          <TextInput placeholder="Address" style={{ borderWidth: 1, marginVertical: 4 }} onChangeText={v => setForm({ ...form, address: v })} />
          <TextInput placeholder="Preferred Date & Time" style={{ borderWidth: 1, marginVertical: 4 }} onChangeText={v => setForm({ ...form, datetime: v })} />
          <Button title="Submit Request" onPress={() => submitRequest(answers)} />
        </>
      )}

      {step === 6 && (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>📬 New Install Requests:</Text>
          {requests.map((req, i) => (
            <View key={i} style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
              <Text>Name: {req.name}</Text>
              <Text>Phone: {req.phone}</Text>
              <Text>Address: {req.address}</Text>
              <Text>Date/Time: {req.datetime}</Text>
              <Text>Quantity: {req.quantity}</Text>
              <Text>Requested Tire: {req.tire.brand} - {req.tire.type}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import calculateResults from './utils/calculations';

export default function HomeScreen() {
  const initialGrades: Record<string, string> = {
    "Note Abschlussprüfung Teil 1": '',
    "Dokumentation der betrieblichen Projektarbeit": '',
    "Präsentation": '',
    "Fachgespräch": '',
    "Note Abschlussprüfung Teil 2: Planen eines Softwareproduktes": '',
    "Note Abschlussprüfung Teil 2: Entwicklung und Umsetzung von Algorithmen": '',
    "Note Abschlussprüfung Teil 2: Wirtschaft und Soziales": '',
  };

  const [grades, setGrades] = useState<Record<string, string>>(initialGrades);
  const [result, setResult] = useState<{ passed: boolean; total: number; finalGrade: string; gradeReason: string } | null>(null);

  // Eingabeänderung mit Validierung
  const handleInputChange = (name: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setGrades((prevGrades) => ({
        ...prevGrades,
        [name]: value,
      }));
    } else {
      Alert.alert("Ungültige Eingabe", "Bitte geben Sie nur Zahlen ein.");
    }
  };

  const handleCalculate = () => {
    // Mapping von Eingabeschlüsseln zu Berechnungsschlüsseln
    const keyMapping = {
      "Note Abschlussprüfung Teil 1": "teil1",
      "Dokumentation der betrieblichen Projektarbeit": "teil2_p1_doku",
      "Präsentation": "teil2_p1_präsi",
      "Fachgespräch": "teil2_p1_gespräch",
      "Note Abschlussprüfung Teil 2: Planen eines Softwareproduktes": "teil2_p2_planung",
      "Note Abschlussprüfung Teil 2: Entwicklung und Umsetzung von Algorithmen": "teil2_p2_algorithmen",
      "Note Abschlussprüfung Teil 2: Wirtschaft und Soziales": "teil2_ws",
    };

    // Schlüssel umwandeln und Werte in numerische Form umwandeln
    const numericGrades = Object.fromEntries(
      Object.entries(grades).map(([key, value]) => [
        keyMapping[key],
        parseFloat(value) || 0,
      ])
    );

    console.log("Eingabewerte nach Mapping und Parsing:", numericGrades);

    try {
      const result = calculateResults(numericGrades);
      console.log("Berechnungsergebnis:", result);
      setResult(result);
    } catch (error) {
      console.error("Fehler bei der Berechnung:", error);
      Alert.alert("Fehler", "Es gab ein Problem bei der Berechnung. Bitte prüfen Sie Ihre Eingaben.");
    }
  };

  const handleReset = () => {
    setGrades(initialGrades);
    setResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Prüfungsnoten eingeben</Text>
      {Object.keys(grades).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text>{key}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={grades[key]}
            onChangeText={(text) => {
              let numericValue = parseInt(text, 10);
              if (!isNaN(numericValue)) {
                numericValue = Math.min(Math.max(numericValue, 0), 100);
                handleInputChange(key, numericValue.toString());
              } else {
                handleInputChange(key, "");
              }
            }}
            placeholder="Note eingeben"
          />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Berechnen" onPress={handleCalculate} />
        <Button title="Zurücksetzen" onPress={handleReset} color="red" />
      </View>
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Gesamtnote: {result.finalGrade}</Text>
          <Text style={styles.resultText}>Punktzahl: {result.total.toFixed(2)}%</Text>
          <Text style={styles.resultText}>{result.passed ? 'Bestanden' : 'Nicht bestanden'}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
});

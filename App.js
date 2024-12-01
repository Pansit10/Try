import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import { captureRef } from "react-native-view-shot";

export default function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef();

  const handleGenerate = () => {
    if (!name || !course || !date) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    setShowCertificate(true);
  };

  const handleDownloadPDF = async () => {
    try {
      const uri = await captureRef(certificateRef, {
        format: "png",
        quality: 1,
      });

      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
              }
              .certificate {
                border: 2px solid #000;
                padding: 20px;
                width: 600px;
                margin: 0 auto;
              }
              .title {
                font-size: 22px;
                font-weight: bold;
              }
              .content {
                font-size: 16px;
                margin: 20px 0;
              }
              .signature {
                margin-top: 40px;
                border-top: 1px solid #000;
                width: 200px;
                margin-left: auto;
                margin-right: auto;
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="title">Certificate of Completion</div>
              <div class="content">
                This is to certify that <strong>${name}</strong> has successfully
                completed the <strong>${course}</strong> course.
              </div>
              <div class="content">
                Date of Completion: <strong>${date}</strong>
              </div>
              <div class="signature">Signature</div>
            </div>
          </body>
        </html>
      `;

      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert("Error", "Could not generate the PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Certificate Generator</Text>

      {!showCertificate ? (
        <View style={styles.form}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Course:</Text>
          <TextInput
            style={styles.input}
            value={course}
            onChangeText={setCourse}
            placeholder="Enter course name"
          />

          <Text style={styles.label}>Date:</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />

          <Button title="Generate Certificate" onPress={handleGenerate} />
        </View>
      ) : (
        <View style={styles.certificateContainer} ref={certificateRef}>
          <Text style={styles.certificateTitle}>Certificate of Completion</Text>
          <Text style={styles.certificateContent}>
            This is to certify that <Text style={styles.bold}>{name}</Text> has
            successfully completed the <Text style={styles.bold}>{course}</Text>{" "}
            course.
          </Text>
          <Text style={styles.certificateContent}>
            Date of Completion: <Text style={styles.bold}>{date}</Text>
          </Text>
          <View style={styles.signature}>
            <Text>Signature:</Text>
            <View style={styles.signatureLine} />
          </View>

          <Button title="Download as PDF" onPress={handleDownloadPDF} />
          <Button
            title="Generate Another Certificate"
            onPress={() => setShowCertificate(false)}
            color="#999"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  certificateContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    textAlign: "center",
  },
  certificateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  certificateContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  signature: {
    marginTop: 30,
    alignItems: "center",
  },
  signatureLine: {
    marginTop: 10,
    width: 200,
    borderTopWidth: 1,
    borderColor: "#000",
  },
});

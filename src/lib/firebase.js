// Firebase configuration - Mock implementation for now
  // This will be replaced with actual Firebase config when user provides credentials
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, set } from "firebase/database";
  import { getAuth } from "firebase/auth";
  

  // export const firebaseConfig = {
  // apiKey: "AIzaSyAGw8X9OzGQUgFFElmXTvaBzzeXSU8PjNo",
  // authDomain: "dbtm-app.firebaseapp.com",
  // databaseURL: "https://dbtm-app-default-rtdb.firebaseio.com",
  // projectId: "dbtm-app",
  // storageBucket: "dbtm-app.appspot.com",  // ✅ Fixed here
  // messagingSenderId: "1009840011722",
  // appId: "1:1009840011722:web:1a1cdf7396d2c3179eb733",
  // measurementId: "G-NDLW3PETJB"
  // };


  // Mock Firebase functions for localStorage fallback
  export const mockFirebase = {
    auth: {
      signInWithEmailAndPassword: async (email, password) => {
        // Mock authentication - store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return { user };
        }
        throw new Error('Invalid credentials');
      },
      createUserWithEmailAndPassword: async (email, password) => {
        // Mock user creation
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = { id: Date.now().toString(), email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { user: newUser };
      },
      signOut: async () => {
        localStorage.removeItem('currentUser');
      },
      onAuthStateChanged: (callback) => {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        callback(user);
        return () => {}; // unsubscribe function
      }
    },
    database: {
      ref: (path) => ({
        push: (data) => {
          const key = Date.now().toString();
          const existingData = JSON.parse(localStorage.getItem(path) || '{}');
          existingData[key] = data;
          localStorage.setItem(path, JSON.stringify(existingData));
          return { key };
        },
        set: (data) => {
          localStorage.setItem(path, JSON.stringify(data));
        },
        on: (eventType, callback) => {
          const data = JSON.parse(localStorage.getItem(path) || '{}');
          callback({ val: () => data });
          return () => {}; // unsubscribe function
        },
        off: () => {},
        once: (eventType) => {
          const data = JSON.parse(localStorage.getItem(path) || '{}');
          return Promise.resolve({ val: () => data });
        }
      })
    }
  };

  // ESP32 Mock Communication
  export const esp32Communication = {
    startMeasurement: async (type) => {
      return new Promise((resolve, reject) => {
        const socket = new WebSocket('ws://192.168.0.135'); // Replace with ESP32 IP

        socket.onopen = () => {
          console.log("✅ WebSocket connected");
          socket.send(type); // 'body' or 'activity'
        };

        socket.onmessage = (event) => {
          console.log("📡 Received data:", event.data);
          const parsed = JSON.parse(event.data);
          socket.close();
          resolve(parsed);
        };

        socket.onerror = (err) => {
          console.error("❌ WebSocket error", err);
          reject(err);
        };
      });
    }
  };

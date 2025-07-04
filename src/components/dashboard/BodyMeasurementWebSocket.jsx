import React, { useEffect, useRef, useState } from 'react';
import BodyMeasurementControl from './BodyMeasurementControl';
import { useToast } from '@/components/ui/use-toast';

const BodyMeasurementWebSocket = ({ onLiveMeasurement, addFinalMeasurement, esp32Ip }) => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [measurementType, setMeasurementType] = useState('');
  const [canSelectMeasurements, setCanSelectMeasurements] = useState(false);
  const [lastSentMeasurementId, setLastSentMeasurementId] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [clientId] = useState(getOrCreateClientId);
  const { toast } = useToast();

  function getOrCreateClientId() {
    let id = localStorage.getItem('clientId');
    if (!id) {
      id = `webapp_${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem('clientId', id);
    }
    return id;
  }

  // Connect WebSocket when esp32Ip changes
  useEffect(() => {
    if (!esp32Ip) return;
    const wsUrl = `ws://${esp32Ip}:81/`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      toast({
        title: 'WebSocket Connected ✅',
        description: `Connected to ESP32 at ${wsUrl}`,
      });
      ws.current.send(
        JSON.stringify({
          type: 'UI_CLIENT_CONNECTED',
          clientId,
        })
      );
    };

    ws.current.onerror = (err) => {
      setIsConnected(false);
      toast({
        title: 'WebSocket Error ❌',
        description: `Could not connect to ESP32 at ${wsUrl}`,
        variant: 'destructive',
      });
    };

    ws.current.onmessage = (event) => {
      const data = event.data;
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'live_measurement') {
          onLiveMeasurement(parsed.data);
        }
        if (parsed.type === 'done') {
          const newData = mapSnakeToCamel(parsed.data);
          setMeasurements((prev) => {
            const updated = {
              ...newData,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              id: Date.now(),
            };
            addFinalMeasurement(updated);
            return [updated, ...prev];
          });
          setMeasuring(true);
          setMeasurementType('');
          onLiveMeasurement(null);
        }
      } catch (err) {
        // ignore non-JSON
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [esp32Ip]);

  const startBodyMeasurement = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send('START_MEASUREMENT');
      setMeasuring(true);
      setMeasurementType('body');

      setTimeout(() => {
        setMeasuring(false);
      }, 30000);

      setTimeout(() => {
        setCanSelectMeasurements(true);
      }, 2000);
    } else {
      toast({
        title: 'WebSocket Not Connected ❌',
        description: 'Cannot start measurement — ESP32 is not connected.',
        variant: 'destructive',
      });
    }
  };

  const sendMeasurementCommand = (code) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(String(code));
      setLastSentMeasurementId(code);
    } else {
      toast({
        title: 'WebSocket Not Connected ❌',
        description: "Can't send command — ESP32 is disconnected.",
        variant: 'destructive',
      });
    }
  };

  const handleManualAnkleHeight = (value) => {
    const updated = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      ankleHeight: value,
    };

    setMeasurements((prev) => [updated, ...prev]);
    addFinalMeasurement(updated);
  };

  const handleNewMeasurement = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send('START_MEASUREMENT');
      setMeasuring(true);
      setMeasurementType('body');

      setTimeout(() => {
        setMeasuring(false);
      }, 30000);

      setTimeout(() => {
        setCanSelectMeasurements(true);
      }, 2000);
    } else {
      toast({
        title: 'WebSocket Not Connected ❌',
        description: 'Cannot start measurement — ESP32 is not connected.',
        variant: 'destructive',
      });
    }
  };

  function mapSnakeToCamel(obj) {
    if (!obj) return obj;
    const map = {
      crown_height: 'crownHeight',
      shoulder_height: 'shoulderHeight',
      elbow_reach: 'elbowReach',
      hip_height: 'hipHeight',
      hand_reach: 'handReach',
      knee_height: 'kneeHeight',
      ankle_height: 'ankleHeight',
      weight: 'weight',
      name: 'name',
      age: 'age',
    };
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [map[k] || k, v]));
  }

  return (
    <BodyMeasurementControl
      startBodyMeasurement={startBodyMeasurement}
      measuring={measuring}
      measurementType={measurementType}
      canSelectMeasurements={canSelectMeasurements}
      lastSentMeasurementId={lastSentMeasurementId}
      onSendCode={sendMeasurementCommand}
      measurements={measurements}
      onManualAnkleHeight={handleManualAnkleHeight}
      onNewMeasurement={handleNewMeasurement}
      esp32Ip={esp32Ip}
    />
  );
};

export default BodyMeasurementWebSocket;
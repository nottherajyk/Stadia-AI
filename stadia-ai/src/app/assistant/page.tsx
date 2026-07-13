'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  type?: 'text' | 'route' | 'food' | 'crowd';
  data?: any;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'Hello! I am your StadiaAI Assistant. How can I assist you with your stadium experience today? I can help with routing, food concessions, crowd queries, and emergency alerts.',
    time: '20:45',
  },
  {
    id: '2',
    sender: 'user',
    text: "What's the fastest route to Gate B?",
    time: '20:46',
  },
  {
    id: '3',
    sender: 'ai',
    text: 'I have analyzed the current crowd density and queue lengths. The fastest route is via the East outer concourse, avoiding the main hallway congestion.',
    time: '20:46',
    type: 'route',
    data: {
      title: 'Optimal Route to Gate B',
      eta: '4 mins',
      distance: '320m',
      crowd: 'Low',
    },
  },
  {
    id: '4',
    sender: 'user',
    text: 'Any food recommendations near Section 204?',
    time: '20:47',
  },
  {
    id: '5',
    sender: 'ai',
    text: 'Here are the food options closest to Section 204 with the shortest wait times:',
    time: '20:48',
    type: 'food',
    data: [
      { name: 'FIFA Burger Concession', rating: 4.8, type: 'Fast Food', wait: '3 mins', icon: '🍔' },
      { name: 'Taco Stadium Hub', rating: 4.5, type: 'Mexican', wait: '5 mins', icon: '🌮' },
      { name: 'Lusail Delights', rating: 4.2, type: 'Snacks & Drinks', wait: '1 min', icon: '🥤' },
    ],
  },
];

const suggestedPrompts = [
  'Find nearest restroom',
  'Queue times at Gate A',
  'Weather update',
  'Navigate to my seat',
  'Parking availability',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      containerRef.current
        ?.querySelectorAll(`.${styles.animateItem}`)
        .forEach((el) => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'none';
        });
      return;
    }

    let ctx: ReturnType<typeof import('gsap')['default']['context']> | undefined;

    (async () => {
      const gsap = (await import('gsap')).default;
      ctx = gsap.context(() => {
        gsap.to(`.${styles.chatHeader}`, { opacity: 1, y: 0, duration: 0.5 });
        gsap.to(`.${styles.message}`, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 });
        gsap.to(`.${styles.suggestedPrompts}`, { opacity: 1, duration: 0.5, delay: 0.4 });
        gsap.to(`.${styles.inputArea}`, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 });
      }, containerRef);
    })();

    return () => ctx?.revert();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: userTime,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let aiText = "I've received your query. Here is the operational data related to it.";
      let type: Message['type'] = 'text';
      let data: any = null;

      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes('restroom') || lowerText.includes('seat')) {
        aiText = 'I have mapped the route to the nearest facilities from your seat.';
        type = 'route';
        data = {
          title: 'Route to Closest Facilities',
          eta: '2 mins',
          distance: '150m',
          crowd: 'Very Low',
        };
      } else if (lowerText.includes('queue') || lowerText.includes('gate a')) {
        aiText = 'Here is the current crowd and queue summary for the gates:';
        type = 'crowd';
        data = {
          zones: [
            { name: 'Gate A Entrance', percent: 28, status: 'low' },
            { name: 'Gate B Entrance', percent: 64, status: 'medium' },
            { name: 'Gate C Entrance', percent: 92, status: 'high' },
          ],
          overall: 'Moderate (61% avg)',
        };
      } else if (lowerText.includes('weather')) {
        aiText = 'Current stadium climate: 24°C, Partly Cloudy, humidity at 45% with optimal natural ventilation active.';
      } else if (lowerText.includes('parking')) {
        aiText = 'Parking Lot availability: Lot A (15% spaces left), Lot B (38% left), Lot C (66% left). Lot C is recommended for faster entry.';
      }

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        time: aiTime,
        type,
        data,
      };

      setMessages((prev) => [...prev, newAiMessage]);
    }, 1500);
  };

  const handleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Queue times at Gate A');
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.page} ref={containerRef}>
        <div className={styles.chatContainer}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.aiAvatar}>🤖</div>
              <div className={styles.headerInfo}>
                <h1>StadiaAI Command Center</h1>
                <p>FIFA World Cup 2026 Virtual Assistant</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <StatusChip label="Online" status="active" pulse />
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.sender === 'user' ? styles.messageUser : styles.messageAi}`}
                style={{ opacity: 1, transform: 'none' }} // Ensure visibility during render
              >
                <div className={styles.messageAvatar}>
                  {msg.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className={styles.messageBubble}>
                  <div>{msg.text}</div>
                  
                  {/* Rich Route Card */}
                  {msg.type === 'route' && msg.data && (
                    <div className={styles.responseCards}>
                      <GlassCard padding="sm" className={styles.routeCard}>
                        <div className={styles.routeMapPreview}>
                          <div className={styles.mapDots}>
                            <div className={styles.mapDot} />
                            <div className={styles.mapLine} />
                            <div className={styles.mapDot} />
                          </div>
                        </div>
                        <div className={styles.routeDetails}>
                          <h4 className={styles.routeTitle}>📍 {msg.data.title}</h4>
                          <div className={styles.routeStats}>
                            <div className={styles.routeStat}>
                              <span className={styles.routeStatValue}>{msg.data.eta}</span>
                              <span className={styles.routeStatLabel}>ETA</span>
                            </div>
                            <div className={styles.routeStat}>
                              <span className={styles.routeStatValue}>{msg.data.distance}</span>
                              <span className={styles.routeStatLabel}>Distance</span>
                            </div>
                            <div className={styles.routeStat}>
                              <span className={styles.routeStatValue} style={{ color: '#22C55E' }}>{msg.data.crowd}</span>
                              <span className={styles.routeStatLabel}>Crowd</span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  )}

                  {/* Rich Food Cards */}
                  {msg.type === 'food' && msg.data && (
                    <div className={styles.restaurantCards}>
                      {msg.data.map((food: any, idx: number) => (
                        <GlassCard key={idx} padding="sm" className={styles.restaurantCard}>
                          <span className={styles.restaurantIcon}>{food.icon}</span>
                          <div className={styles.restaurantInfo}>
                            <h4 className={styles.restaurantName}>{food.name}</h4>
                            <div className={styles.restaurantMeta}>
                              <span>{food.type}</span>
                              <span>·</span>
                              <span className={styles.restaurantRating}>★ {food.rating}</span>
                            </div>
                          </div>
                          <span className={styles.restaurantWait}>{food.wait}</span>
                        </GlassCard>
                      ))}
                    </div>
                  )}

                  {/* Rich Crowd Card */}
                  {msg.type === 'crowd' && msg.data && (
                    <div className={styles.responseCards}>
                      <GlassCard padding="md" className={styles.crowdCard}>
                        <h4 className={styles.crowdTitle}>👥 Gate Queue Status</h4>
                        <div className={styles.crowdZones}>
                          {msg.data.zones.map((zone: any, idx: number) => (
                            <div key={idx} className={styles.crowdZone}>
                              <span className={styles.zoneName}>{zone.name}</span>
                              <div className={styles.zoneBar}>
                                <div
                                  className={`${styles.zoneBarFill} ${
                                    zone.status === 'low'
                                      ? styles.zoneBarLow
                                      : zone.status === 'medium'
                                      ? styles.zoneBarMedium
                                      : styles.zoneBarHigh
                                  }`}
                                  style={{ width: `${zone.percent}%` }}
                                />
                              </div>
                              <span
                                className={`${styles.zonePercent} ${
                                  zone.status === 'low'
                                    ? styles.zonePercentLow
                                    : zone.status === 'medium'
                                    ? styles.zonePercentMedium
                                    : styles.zonePercentHigh
                                  }`}
                              >
                                {zone.percent}%
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.crowdSummary}>
                          <span>Overall Congestion: </span>
                          <span className={styles.crowdOverall}>{msg.data.overall}</span>
                        </div>
                      </GlassCard>
                    </div>
                  )}

                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={styles.typingIndicator} style={{ opacity: 1 }}>
                <div className={styles.messageAvatar}>🤖</div>
                <div className={styles.typingBubble}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className={styles.suggestedPrompts}>
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className={styles.promptChip}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={`${styles.inputWrapper} ${isFocused ? styles.inputWrapperFocused : ''}`}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask StadiaAI a question..."
                className={styles.textInput}
              />
              <button
                type="button"
                onClick={handleVoice}
                className={`${styles.voiceButton} ${isRecording ? styles.voiceButtonActive : ''}`}
                aria-label="Voice input"
              >
                <svg className={styles.micIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSend()}
                className={styles.sendButton}
                aria-label="Send message"
              >
                <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

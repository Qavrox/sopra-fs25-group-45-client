'use client';

import { useState } from 'react';
import { Card, Typography, Button, List, Divider } from 'antd';
import { QuestionCircleOutlined, CloseOutlined, BookOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const tutorialData = {
  basics: [
    "Each player receives two private cards (hole cards).",
    "Five community cards are placed face-up on the table.",
    "Players must make the best five-card hand using any combination of their hole cards and community cards.",
    "The player with the best hand at showdown wins the pot."
  ],
  actions: [
    "Check: Pass the action to the next player (only if no bet has been made).",
    "Bet: Place a wager (when no previous bet has been made).",
    "Call: Match the current bet.",
    "Raise: Increase the current bet.",
    "Fold: Discard your hand and forfeit the pot."
  ],
  gameFlow: [
    "Pre-flop: First betting round after receiving hole cards.",
    "Flop: Three community cards are dealt, followed by betting.",
    "Turn: A fourth community card is dealt, followed by betting.",
    "River: A fifth community card is dealt, followed by final betting.",
    "Showdown: If multiple players remain, cards are shown and best hand wins."
  ]
};

export default function TutorialCard() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleTutorial = () => {
    setIsOpen(!isOpen);
  };

  const navigateToTutorialPage = () => {
    router.push('/tutorial');
  };

  return (
    <>
      {/* Tutorial Toggle Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<QuestionCircleOutlined />}
        onClick={toggleTutorial}
        className="tutorial-toggle-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          backgroundColor: '#1890ff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
        size="large"
      />

      {/* Tutorial Card */}
      {isOpen && (
        <div className="tutorial-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 150,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold', color: 'white' }}>Poker Tutorial</span>
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  onClick={toggleTutorial}
                  style={{ color: '#ff4d4f' }}
                />
              </div>
            }
            style={{ 
              width: '80%', 
              maxWidth: '800px', 
              maxHeight: '80vh', 
              overflowY: 'auto',
              backgroundColor: '#1c7430',
              color: 'white',
              border: '5px solid #764a21'
            }}
            headStyle={{ backgroundColor: '#0d1117', color: 'white' }}
            bodyStyle={{ backgroundColor: '#1c7430', color: 'white' }}
          >
            <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Game Basics</div>
            <List
              dataSource={tutorialData.basics}
              renderItem={(item, index) => (
                <List.Item style={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {index + 1}. {item}
                </List.Item>
              )}
            />
            
            <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            
            <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Player Actions</div>
            <List
              dataSource={tutorialData.actions}
              renderItem={(item) => (
                <List.Item style={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {item}
                </List.Item>
              )}
            />
            
            <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            
            <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Game Flow</div>
            <List
              dataSource={tutorialData.gameFlow}
              renderItem={(item, index) => (
                <List.Item style={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {index + 1}. {item}
                </List.Item>
              )}
            />
            
            <div style={{ marginTop: '20px', color: '#ffffffaa' }}>
              For more detailed rules and video tutorials, visit the Rules and Tutorials page.
            </div>
            
            {/* Go to tutorial page */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<BookOutlined />} 
                onClick={navigateToTutorialPage}
                style={{
                  backgroundColor: '#f5a623',
                  borderColor: '#f5a623',
                  fontWeight: 'bold',
                  padding: '0 20px',
                  height: '40px'
                }}
              >
                See Full Tutorial
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
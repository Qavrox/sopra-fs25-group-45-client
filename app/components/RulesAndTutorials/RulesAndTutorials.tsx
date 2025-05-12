'use client';
import { useState } from 'react';
import { Tabs, Card, Typography, List, Divider, Row, Col } from 'antd';
import { BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styles from './RulesAndTutorials.module.css';
import { useRouter } from 'next/navigation';


const { Title, Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;

const rulesData = {
  basic: "Texas Hold'em is a community card poker variant. Each player is dealt two private cards, followed by five community cards placed face-up on the table. Players must make the best five-card hand using any combination of their two hole cards and the five community cards.",
  structure: [
    "Blinds: Before cards are dealt, two players post blind bets. The player to the left of the dealer posts the small blind, and the next player posts the big blind.",
    "Deal: Each player receives two private cards (hole cards).",
    "Pre-flop: First betting round begins with the player to the left of the big blind.",
    "Flop: Three community cards are dealt face up, followed by a second betting round.",
    "Turn: A fourth community card is dealt, followed by a third betting round.",
    "River: A fifth and final community card is dealt, followed by a final betting round.",
    "Showdown: If more than one player remains, cards are shown and the best hand wins the pot."
  ],
  bettingOptions: [
    "Check: Pass the action to the next player (only if no bet has been made).",
    "Bet: Place a wager (when no previous bet has been made).",
    "Call: Match the current bet.",
    "Raise: Increase the current bet.",
    "Fold: Discard your hand and forfeit the pot."
  ],
  handRankings: [
    "Royal Flush: A, K, Q, J, 10, all of the same suit.",
    "Straight Flush: Five cards in sequence, all of the same suit.",
    "Four of a Kind: Four cards of the same rank.",
    "Full House: Three of a kind plus a pair.",
    "Flush: Five cards of the same suit, not in sequence.",
    "Straight: Five cards in sequence, not all of the same suit.",
    "Three of a Kind: Three cards of the same rank.",
    "Two Pair: Two different pairs.",
    "Pair: Two cards of the same rank.",
    "High Card: When no player has any of the above."
  ]
};

export default function RulesAndTutorials() {
  const [activeTab, setActiveTab] = useState('rules');
  const router = useRouter();
  return (
      <div className={styles.pageWrapper}>
        <Title level={2} style={{textAlign: 'center', marginBottom: '32px'}}>
          Rules and Tutorials
        </Title>

        <div className={styles.tabsWrapper}>
          <Tabs defaultActiveKey="rules" centered onChange={setActiveTab}>
            <TabPane
                tab={<span><BookOutlined/> Rules</span>}
                key="rules"
            >
              <Card title="Texas Hold'em Poker Rules" className={styles.tabCard}>
                <Title level={4} className={styles.heading}>Basic Rules</Title>
                <Paragraph className={styles.paragraph}>{rulesData.basic}</Paragraph>
                <Divider/>

                <Title level={4} className={styles.heading}>Game Structure</Title>
                <List
                    size="small"
                    dataSource={rulesData.structure}
                    renderItem={(item, index) => <List.Item>{`${index + 1}. ${item}`}</List.Item>}
                />
                <Divider/>

                <Title level={4} className={styles.heading}>Betting Options</Title>
                <List
                    size="small"
                    dataSource={rulesData.bettingOptions}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />
                <Divider/>

                <Title level={4} className={styles.heading}>Hand Rankings</Title>
                <List
                    size="small"
                    dataSource={rulesData.handRankings}
                    renderItem={(item, index) => <List.Item>{`${index + 1}. ${item}`}</List.Item>}
                />
                <Paragraph type="secondary" className={styles.paragraph}>
                  Source: Adapted from Wikipedia's Texas Hold'em article.
                </Paragraph>
              </Card>
            </TabPane>

            <TabPane
                tab={<span><VideoCameraOutlined/> Tutorials</span>}
                key="tutorials"
            >
              <Card title="Video Tutorials" className={styles.tabCard}>
                <Row gutter={[16, 24]}>
                  <Col xs={24} md={12}>
                    <Title level={4} className={styles.heading}>Beginner's Guide to Texas Hold'em</Title>
                    <div className={styles.videoWrapper}>
                      <iframe
                          src="https://www.youtube.com/embed/GAoR9ji8D6A"
                          title="Texas Hold'em Poker Tutorial"
                          frameBorder="0"
                          allowFullScreen
                      />
                    </div>
                    <Paragraph className={styles.paragraph}>
                      This comprehensive tutorial covers all the basics of Texas Hold'em poker, including hand rankings,
                      betting rounds, and strategy tips.
                    </Paragraph>
                  </Col>
                  <Col xs={24} md={12}>
                    <Title level={4} className={styles.heading}>Advanced Strategy Tips</Title>
                    <div className={styles.videoWrapper}>
                      <iframe
                          src="https://www.youtube.com/embed/pthll8v-1z4"
                          title="Advanced Poker Strategy"
                          frameBorder="0"
                          allowFullScreen
                      />
                    </div>
                    <Paragraph className={styles.paragraph}>
                      Once you've mastered the basics, this video will help you improve with advanced tactics:
                      position play, reading opponents, and pot odds.
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.returnButtonWrapper}>
          <button className={styles.returnButton} onClick={() => router.push('/')}>
            Back to homepage
          </button>
        </div>
      </div>
  );
}

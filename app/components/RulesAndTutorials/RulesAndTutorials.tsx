'use client';
import { useState } from 'react';

export default function RulesAndTutorials() {
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Rules and Tutorials</h1>
      
      <div className="w-full mb-6">
        <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-md">
          <button 
            className={`py-2 px-4 rounded-sm font-medium text-sm transition-all ${activeTab === 'rules' ? 'bg-white shadow-sm text-gray-950' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
          <button 
            className={`py-2 px-4 rounded-sm font-medium text-sm transition-all ${activeTab === 'tutorials' ? 'bg-white shadow-sm text-gray-950' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tutorials')}
          >
            Tutorials
          </button>
        </div>
      </div>
      
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Texas Hold'em Poker Rules</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Basic Rules</h3>
            <p className="mb-3">
              Texas Hold'em is a community card poker variant. Each player is dealt two private cards, 
              followed by five community cards placed face-up on the table. Players must make the best 
              five-card hand using any combination of their two hole cards and the five community cards.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Game Structure</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Blinds:</strong> Before cards are dealt, two players post blind bets. The player 
                to the left of the dealer posts the small blind, and the next player posts the big blind.
              </li>
              <li>
                <strong>Deal:</strong> Each player receives two private cards (hole cards).
              </li>
              <li>
                <strong>Pre-flop:</strong> First betting round begins with the player to the left of the big blind.
              </li>
              <li>
                <strong>Flop:</strong> Three community cards are dealt face up, followed by a second betting round.
              </li>
              <li>
                <strong>Turn:</strong> A fourth community card is dealt, followed by a third betting round.
              </li>
              <li>
                <strong>River:</strong> A fifth and final community card is dealt, followed by a final betting round.
              </li>
              <li>
                <strong>Showdown:</strong> If more than one player remains, cards are shown and the best hand wins the pot.
              </li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Betting Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Check:</strong> Pass the action to the next player (only if no bet has been made).
              </li>
              <li>
                <strong>Bet:</strong> Place a wager (when no previous bet has been made).
              </li>
              <li>
                <strong>Call:</strong> Match the current bet.
              </li>
              <li>
                <strong>Raise:</strong> Increase the current bet.
              </li>
              <li>
                <strong>Fold:</strong> Discard your hand and forfeit the pot.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Hand Rankings (Highest to Lowest)</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Royal Flush:</strong> A, K, Q, J, 10, all of the same suit.</li>
              <li><strong>Straight Flush:</strong> Five cards in sequence, all of the same suit.</li>
              <li><strong>Four of a Kind:</strong> Four cards of the same rank.</li>
              <li><strong>Full House:</strong> Three of a kind plus a pair.</li>
              <li><strong>Flush:</strong> Five cards of the same suit, not in sequence.</li>
              <li><strong>Straight:</strong> Five cards in sequence, not all of the same suit.</li>
              <li><strong>Three of a Kind:</strong> Three cards of the same rank.</li>
              <li><strong>Two Pair:</strong> Two different pairs.</li>
              <li><strong>Pair:</strong> Two cards of the same rank.</li>
              <li><strong>High Card:</strong> When no player has any of the above.</li>
            </ol>
            
            <p className="mt-4 text-sm text-gray-500">
              Source: Adapted from Wikipedia's Texas Hold'em article.
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'tutorials' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Video Tutorials</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Beginner's Guide to Texas Hold'em</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  className="w-full h-96"
                  src="https://www.youtube.com/embed/GAoR9ji8D6A" 
                  title="Texas Hold'em Poker Tutorial" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-3 text-gray-700">
                This comprehensive tutorial covers all the basics of Texas Hold'em poker, including hand rankings, 
                betting rounds, and basic strategy tips for beginners.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Advanced Strategy Tips</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  className="w-full h-96"
                  src="https://www.youtube.com/embed/DLGZo7MUE50" 
                  title="Advanced Poker Strategy" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-3 text-gray-700">
                Once you've mastered the basics, this video will help you improve your game with advanced 
                concepts like position play, reading opponents, and calculating pot odds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
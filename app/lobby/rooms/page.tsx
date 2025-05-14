'use client';

import RoomBrowser from '@/components/RoomBrowser/RoomBrowser';
import { Card } from 'antd';

export default function RoomBrowserPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="card-container">
        <Card>
          <RoomBrowser />
        </Card>
      </div>
    </main>
  );
}
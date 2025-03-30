import RoomBrowser from '@/components/RoomBrowser/page';

export default function RoomBrowserPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Browse Available Tables</h1>
      <RoomBrowser />
    </main>
  );
}
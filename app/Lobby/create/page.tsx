import CreateRoomForm from '@/components/CreateRoom/CreateRoomForm';

export default function CreateGamePage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Game</h1>
      <CreateRoomForm />
    </main>
  );
}
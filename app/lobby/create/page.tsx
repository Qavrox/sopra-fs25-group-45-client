import CreateRoomForm from '@/components/CreateRoom/CreateRoomForm';

export default function CreateGamePage() {
  return (
    <main className="create-game-container">
      <h1 className="create-game-title">Create a New Game</h1>
      <CreateRoomForm />
    </main>
  );
}
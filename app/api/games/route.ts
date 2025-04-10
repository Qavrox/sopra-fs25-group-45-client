export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch('http://localhost:8080/games', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const games = await response.json();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { message: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch('http://localhost:8080/games', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const game = await response.json();
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { message: 'Failed to create game' },
      { status: 500 }
    );
  }
}

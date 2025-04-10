export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`http://localhost:8080/games/${params.id}/join`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: body.password || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json(
      { message: 'Failed to join game' },
      { status: 500 }
    );
  }
}

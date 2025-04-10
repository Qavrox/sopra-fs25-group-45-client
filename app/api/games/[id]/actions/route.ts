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
    
    // Map action to the appropriate endpoint on backend
    let endpoint;
    switch (body.action) {
      case 'check':
        endpoint = `/games/${params.id}/check`;
        break;
      case 'bet':
        endpoint = `/games/${params.id}/bet`;
        break;
      case 'call':
        endpoint = `/games/${params.id}/call`;
        break;
      case 'raise':
        endpoint = `/games/${params.id}/raise`;
        break;
      case 'fold':
        endpoint = `/games/${params.id}/fold`;
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = await fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: body.userId,
        amount: body.amount || 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing game action:', error);
    return NextResponse.json(
      { message: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

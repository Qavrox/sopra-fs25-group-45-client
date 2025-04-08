export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`http://localhost:8080/games/${params.id}/probability`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const probability = await response.json();
    return NextResponse.json(probability);
  } catch (error) {
    console.error('Error calculating probability:', error);
    return NextResponse.json(
      { message: 'Failed to calculate probability' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/services/apiClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Set token for API client
    apiClient.setToken(token);
    
    // Use the apiClient to get win probability
    // This uses the getWinProbability method from your ApiClient
    const result = await apiClient.getWinProbability(parseInt(params.id));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting win probability:', error);
    
    // Check if it's a structured error with status code
    if (error instanceof Error && 'status' in error) {
      const statusCode = (error as any).status || 500;
      return NextResponse.json(
        { message: error.message || 'Failed to get win probability' },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to get win probability' },
      { status: 500 }
    );
  }
}

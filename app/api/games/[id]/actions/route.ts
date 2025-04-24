import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/api/apiClient';

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
    
    // Set token for API client
    apiClient.setToken(token);
    
    // Use the apiClient to send the action request
    // This uses the correct endpoint from your backend API specification
    const result = await apiClient.submitGameAction(
      parseInt(params.id), 
      {
        action: body.action,
        userId: body.userId,
        amount: body.amount || 0
      }
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing game action:', error);
    
    // Check if it's a structured error with status code
    if (error instanceof Error && 'status' in error) {
      const statusCode = (error as any).status || 500;
      return NextResponse.json(
        { message: error.message || 'Failed to perform action' },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

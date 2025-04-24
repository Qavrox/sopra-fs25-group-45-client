import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/api/apiClient';

// GET handler for fetching all public games
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Set token for API client
    apiClient.setToken(token);
    
    // Use the apiClient to get public games
    // This uses the getPublicGames method from your ApiClient
    const games = await apiClient.getPublicGames();
    
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    
    // Check if it's a structured error with status code
    if (error instanceof Error && 'status' in error) {
      const statusCode = (error as any).status || 500;
      return NextResponse.json(
        { message: error.message || 'Failed to fetch games' },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new game
export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Set token for API client
    apiClient.setToken(token);
    
    // Use the apiClient to create a game
    // This uses the createGame method from your ApiClient
    const result = await apiClient.createGame(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating game:', error);
    
    // Check if it's a structured error with status code
    if (error instanceof Error && 'status' in error) {
      const statusCode = (error as any).status || 500;
      return NextResponse.json(
        { message: error.message || 'Failed to create game' },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create game' },
      { status: 500 }
    );
  }
}

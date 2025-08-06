export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    console.log('Received log request on server:', body);
    // Process the log message
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500 });
  }
}

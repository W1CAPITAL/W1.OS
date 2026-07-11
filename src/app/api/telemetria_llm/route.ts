import { NextResponse } from 'next/server';
import { saveTelemetry } from '@/lib/server-db';

/**
 * POST /api/telemetria_llm
 * Receives payloads from the Windows Python Daemon (NSSM managed).
 */
export async function POST(request: Request) {
  try {
    // 1. JWT Verification would go here (Middleware equivalent)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized: Missing JWT' }, { status: 401 });
    }

    const payload = await request.json();
    
    // 2. Data Validation
    if (!payload.machine_id || !payload.insight_json) {
      return NextResponse.json({ error: 'Bad Request: Missing required fields' }, { status: 400 });
    }

    // 3. Persistence
    const dbResult = await saveTelemetry(payload);

    if (dbResult.success) {
      return NextResponse.json({ 
        message: 'Telemetry synchronized', 
        id: dbResult.id,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(dbResult.error);
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'API Operational', target: 'Ollama Edge Node' });
}
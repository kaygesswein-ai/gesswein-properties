// project/app/api/featured/route.ts
import { NextResponse } from 'next/server';
import { featuredItems } from '../../../lib/featured';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: featuredItems }, { status: 200 });
}

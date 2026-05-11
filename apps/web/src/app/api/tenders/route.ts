import { NextResponse } from 'next/server';
import { tenderRepository } from '@ihaleci/core';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 50);
  const tenders = await tenderRepository.listRecent(limit);
  return NextResponse.json({ tenders });
}
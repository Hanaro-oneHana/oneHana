import { NextRequest, NextResponse } from 'next/server';
import { createOneAccount } from '@/lib/actions/AccountActions';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json(
      { error: 'userId가 필요합니다.' },
      { status: 400 }
    );
  }

  const account = await createOneAccount(userId);
  return NextResponse.json({ account }, { status: 201 });
}

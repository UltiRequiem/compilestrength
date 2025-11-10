import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { saveWorkoutRoutineToDb } from '@/lib/workout-db';
import { WorkoutRoutine } from '@/stores/workout-routine-store';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { routine }: { routine: WorkoutRoutine } = await req.json();

    if (!routine) {
      return new Response('Workout routine is required', { status: 400 });
    }

    console.log('📝 Saving routine for user:', session.user.id, routine.name);

    // Save the routine to the database
    const savedProgram = await saveWorkoutRoutineToDb(routine, session.user.id);

    return Response.json({
      success: true,
      message: 'Workout routine saved successfully',
      programId: savedProgram.id,
    });

  } catch (error) {
    console.error('Save routine API error:', error);
    return new Response('Failed to save workout routine', { status: 500 });
  }
}
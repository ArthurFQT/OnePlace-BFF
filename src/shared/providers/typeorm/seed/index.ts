import { initialParameters } from './initials_parameters';

async function runSeeds() {
  try {
    await initialParameters();
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
  }
}

runSeeds();

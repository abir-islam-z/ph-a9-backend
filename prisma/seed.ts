/* eslint-disable no-console */
import {
  ApprovalStatus,
  FoodCategory,
  PaymentStatus,
  PrismaClient,
  UserRole,
  VoteType,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean the database (optional, remove if you don't want to delete existing data)
  console.log('Cleaning database...');

  await prisma.payment.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.foodSpot.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned');

  // Create users
  console.log('Creating users...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Admin user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      role: UserRole.ADMIN,
      isPremium: true,
      subscriptionExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });

  // Regular user
  const user1 = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: passwordHash,
      role: UserRole.USER,
    },
  });

  // Premium user
  const premiumUser = await prisma.user.create({
    data: {
      name: 'Premium User',
      email: 'premium@example.com',
      password: passwordHash,
      role: UserRole.PREMIUM,
      isPremium: true,
      subscriptionExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log('Users created');

  // Create food spots
  console.log('Creating food spots...');

  const foodSpot1 = await prisma.foodSpot.create({
    data: {
      title: 'Street Food Corner',
      description: 'The best street food in town with a variety of options.',
      location: 'Downtown Dhaka, Road 3',
      minPrice: 50,
      maxPrice: 300,
      category: FoodCategory.STREET_FOOD,
      image: 'https://example.com/street-food.jpg',
      approvalStatus: ApprovalStatus.APPROVED,
      creatorId: user1.id,
    },
  });

  const foodSpot2 = await prisma.foodSpot.create({
    data: {
      title: 'Morning Breakfast',
      description: 'Start your day with our delicious breakfast options.',
      location: 'Gulshan 2, Dhaka',
      minPrice: 100,
      maxPrice: 500,
      category: FoodCategory.BREAKFAST,
      image: 'https://example.com/breakfast.jpg',
      approvalStatus: ApprovalStatus.APPROVED,
      creatorId: premiumUser.id,
      isPremium: true,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const foodSpot3 = await prisma.foodSpot.create({
    data: {
      title: 'Sweet Delights',
      description: 'Traditional Bengali sweets and desserts.',
      location: 'Dhanmondi, Dhaka',
      minPrice: 80,
      maxPrice: 450,
      category: FoodCategory.SWEETS,
      image: 'https://example.com/sweets.jpg',
      approvalStatus: ApprovalStatus.PENDING,
      creatorId: user1.id,
    },
  });

  console.log('Food spots created');

  // Create reviews
  console.log('Creating reviews...');

  await prisma.review.create({
    data: {
      rating: 4.5,
      comment: 'Amazing food, great environment!',
      userId: user1.id,
      foodSpotId: foodSpot2.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5.0,
      comment: "Best street food I've ever had!",
      userId: premiumUser.id,
      foodSpotId: foodSpot1.id,
    },
  });

  // Update total ratings on foodSpots
  await prisma.foodSpot.update({
    where: { id: foodSpot1.id },
    data: { totalRating: 5.0 },
  });

  await prisma.foodSpot.update({
    where: { id: foodSpot2.id },
    data: { totalRating: 4.5 },
  });

  console.log('Reviews created');

  // Create votes
  console.log('Creating votes...');

  await prisma.vote.create({
    data: {
      type: VoteType.UPVOTE,
      userId: user1.id,
      foodSpotId: foodSpot2.id,
    },
  });

  await prisma.vote.create({
    data: {
      type: VoteType.UPVOTE,
      userId: premiumUser.id,
      foodSpotId: foodSpot1.id,
    },
  });

  // Update vote counts
  await prisma.foodSpot.update({
    where: { id: foodSpot1.id },
    data: { totalUpvotes: 1 },
  });

  await prisma.foodSpot.update({
    where: { id: foodSpot2.id },
    data: { totalUpvotes: 1 },
  });

  console.log('Votes created');

  // Create payments
  console.log('Creating payments...');

  await prisma.payment.create({
    data: {
      userId: premiumUser.id,
      planId: 'monthly-premium',
      amount: 500,
      currency: 'BDT',
      status: PaymentStatus.SUCCESS,
      paymentMethod: 'sslcommerz',
      transactionId: 'tx_12345',
      paymentGatewayData: {
        gatewayResponse: 'Payment successful',
        timestamp: new Date().toISOString(),
      },
      durationInDays: 30,
    },
  });

  console.log('Payments created');

  console.log('Seeding completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

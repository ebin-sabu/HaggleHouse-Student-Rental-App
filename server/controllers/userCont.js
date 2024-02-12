import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import { prisma } from "../config/prismaConfig.js";
import jwt from 'jsonwebtoken';


export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  const { email, password, name, landlord } = req.body;

  // Check if the user already exists
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (userExists) {
    return res.status(409).send({ message: "User already registered" }); // Use 409 Conflict for duplicate resource
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with hashed password and potentially other fields
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        landlord,
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Ensure you have a JWT_SECRET in your .env file
      { expiresIn: '1h' } // Token expires in 24 hours
    );

    res.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        landlord: user.landlord,
      },
      token, // Include the token in the response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  // If user is found and password matches
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        landlord: user.landlord,
      },
      token, // Send the token to the client
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

export const makeBid = asyncHandler(async (req, res) => {
  const { userId, propertyId, amount } = req.body;

  // First, find the user by their email
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Ensure the user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Optionally, you can check if the property exists to ensure a valid bid
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  // Check if a bid from this user for this property already exists
  const existingBid = await prisma.bid.findFirst({
    where: {
      AND: [
        { userId: userId },
        { propertyId: propertyId },
      ],
    },
  });

  if (existingBid) {
    return res.status(400).json({ message: "You have already placed a bid on this property" });
  }

  // Create the bid
  try {
    const bid = await prisma.bid.create({
      data: {
        amount: amount,
        property: { connect: { id: propertyId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(200).json({ message: "Bid made successfully", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllBids = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // First, find the user by their email
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Ensure the user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const bids = await prisma.bid.findMany({
      where: {
        userId: userId,
      },
      include: {
        property: true, // Assuming you want to include details of the properties bid on
      },
    });

    if (bids.length > 0) {
      res.status(200).json(bids);
    } else {
      res.status(404).json({ message: "No bids found for this user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export const removeBid = asyncHandler(async (req, res) => {
  const { userId, bidId } = req.body; // Assuming bid ID is passed as a URL parameter // Assuming user ID is passed in the request body or extracted from authentication token

  // First, verify that the bid exists and belongs to the user
  const bid = await prisma.bid.findUnique({
    where: {
      id: bidId,
    },
  });

  if (!bid) {
    return res.status(404).json({ message: "Bid not found" });
  }

  if (bid.userId !== userId) {
    // If the bid does not belong to the user, prevent deletion
    return res.status(403).json({ message: "User not authorized to delete this bid" });
  }

  // If the bid exists and belongs to the user, proceed with deletion
  try {
    await prisma.bid.delete({
      where: {
        id: bidId,
      },
    });

    res.status(200).json({ message: "Bid removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// function to add house to favourites
export const toFav = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Adjusted to use userId
  const { rid } = req.params; // Property ID to add/remove from favorites

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFavorite = user.favResidenciesID.includes(rid);
    const updateData = isFavorite
      ? user.favResidenciesID.filter((id) => id !== rid) // Remove from favorites
      : [...user.favResidenciesID, rid]; // Add to favorites

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favResidenciesID: {
          set: updateData,
        },
      },
    });

    res.json({
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      user: updatedUser,
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Received userId from the request body

  try {
    // Fetch the user with their favorited properties IDs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favResidenciesID: true }, // Assuming this is an array of favorited property IDs
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the properties based on the IDs in favResidenciesID
    const favoritedProperties = await prisma.property.findMany({
      where: {
        id: {
          in: user.favResidenciesID, // Use the 'in' operator to fetch properties whose IDs are in the favResidenciesID array
        },
      },
    });

    res.status(200).json(favoritedProperties);
  } catch (err) {
    throw new Error(err.message);
  }
});


export const getLandlordProperties = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming the landlord's userId is passed as a URL parameter

  try {
    // Fetch properties owned by the landlord, including the bids on each property
    const properties = await prisma.property.findMany({
      where: {
        ownerId: userId, // Assuming your Property model has an ownerId field linking to the User model
      },
      include: {
        bids: true, // Include bids made on the property
      },
    });

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found for this landlord" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import { prisma } from "../config/prismaConfig.js";
import jwt from 'jsonwebtoken';
import upload from '../config/multerConfig.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request object
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


const singleUpload = upload.single('profilePic');

export const createUserWithProfilePic = asyncHandler(async (req, res) => {
  singleUpload(req, res, async (error) => {
    if (error) {
      return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: error.message }] });
    }

    // After upload, construct the user data, including the profilePicUrl from the uploaded file
    const userData = {
      ...req.body,
      profilePicUrl: req.file ? req.file.location : undefined // Use the file location as the profile picture URL
    };

    // Manually call createUser with the constructed user data
    await createUser(userData, res);
  });
});



export const createUser = asyncHandler(async (userData, res) => {
  console.log("creating a user");

  const { email, password, name, landlord, profilePicUrl } = userData;

  let newLandlord;
  if (landlord === 'true') {
    newLandlord = true;
  } else if (landlord === 'false') {
    newLandlord = false;
  } else {
    // Handle unexpected landlord values if necessary
    return res.status(400).send({ message: "Invalid landlord value" });
  }

  // Check if the user already exists
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (userExists) {
    return res.status(409).send({ message: "User already registered" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with hashed password, profile picture, and potentially other fields
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        landlord: newLandlord,
        // Use the provided profile picture URL or the default one if none is provided
        profilePicUrl: profilePicUrl || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        landlord: user.landlord,
        profilePicUrl: user.profilePicUrl,
      },
      token,
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
        profilePicUrl: user.profilePicUrl,
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

  // Convert amount to an integer
  const bidAmount = parseInt(amount, 10); // The second argument, 10, specifies the base for integer conversion

  // Ensure the conversion was successful
  if (isNaN(bidAmount)) {
    return res.status(400).json({ message: "Invalid amount provided. Expected an integer value." });
  }

  // Ensure the user exists and fetch group details if the user is in a group
  const userWithGroup = await prisma.user.findUnique({
    where: { id: userId },
    include: { group: true }, // Include group details
  });
  if (!userWithGroup) {
    return res.status(404).json({ message: "User not found" });
  }

  // Ensure the property exists to ensure a valid bid
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

  // Create the bid with an initial status of PENDING
  try {

    const bid = await prisma.bid.create({
      data: {
        amount: bidAmount,
        property: { connect: { id: propertyId } },
        user: { connect: { id: userId } },
        status: 'PENDING',
        // Correctly connect the group using nested syntax
        group: userWithGroup.group ? { connect: { id: userWithGroup.group.id } } : undefined,
      },
    });


    res.status(200).json({ message: "Bid made successfully", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export const acceptBid = asyncHandler(async (req, res) => {
  const { bidId } = req.body;

  try {
    // Start a transaction
    const transactionResult = await prisma.$transaction(async (prisma) => {
      // Fetch the current bid and property details
      const bidDetails = await prisma.bid.findUnique({
        where: { id: bidId },
        include: { property: true, user: { include: { group: true } } } // Assuming "group" relation exists under user
      });

      // Determine the group size, default to 1 if no group
      const groupSize = bidDetails.user.group?.numberOfPeople || 1;
      let newAvailableRooms = bidDetails.property.availableRooms - groupSize;

      // Update the bid to ACCEPTED
      const updatedBid = await prisma.bid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' },
      });

      // Update the property with the new available rooms count
      await prisma.property.update({
        where: { id: updatedBid.propertyId },
        data: { availableRooms: newAvailableRooms },
      });

      // Only reject other PENDING bids if no available rooms are left
      if (newAvailableRooms <= 0) {
        await prisma.bid.updateMany({
          where: {
            propertyId: updatedBid.propertyId,
            id: { not: bidId },
            status: 'PENDING',
          },
          data: { status: 'REJECTED' },
        });

        await prisma.property.update({
          where: { id: updatedBid.propertyId },
          data: { live: false },
        });
      }

      // Optionally handle rejection of other bids placed by the successful user or their group members on any other properties
      let userIdsToReject = [bidDetails.userId];
      if (bidDetails.user.group) {
        userIdsToReject = userIdsToReject.concat(bidDetails.user.group.memberIds);
      }

      await prisma.bid.updateMany({
        where: {
          id: { not: bidId },
          OR: [
            { userId: { in: userIdsToReject } },
            { groupId: bidDetails.user.group?.id },
          ],
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      });

      return updatedBid; // Return the updated bid as the result of the transaction
    });

    // If the transaction is successful, send back the updated bid
    res.json({ message: "Bid accepted successfully", updatedBid: transactionResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export const rejectBid = asyncHandler(async (req, res) => {
  const { bidId } = req.body; // Assuming the bid ID is sent in the request body

  try {
    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: { status: 'REJECTED' },
    });

    res.json({ message: "Bid rejected successfully", updatedBid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllBids = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Verify the user exists and fetch their group ID if they belong to one
  const userWithGroup = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      group: true, // Include group details to get the group ID
    },
  });

  if (!userWithGroup) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    // Define a variable to hold the condition for fetching bids
    let whereCondition;

    if (userWithGroup.group) {
      // If the user is part of a group, find bids by any user in that group
      whereCondition = {
        group: {
          id: userWithGroup.group.id,
        },
      };
    } else {
      // If the user is not part of a group, only find bids made by the user
      whereCondition = {
        userId: userId,
      };
    }

    // Fetch bids based on the defined condition
    const bids = await prisma.bid.findMany({
      where: whereCondition,
      include: {
        property: {
          include: {
            images: true, // Include images for each property
          },
        },
        user: true, // Include user details for each bid
        group: true, // Include group details for each bid
      },
    });

    if (bids.length > 0) {
      res.status(200).json(bids);
    } else {
      res.status(404).json({ message: "No bids found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export const getAllBidsOnProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params; // Extracting the property ID from the URL

  try {
    const bids = await prisma.bid.findMany({
      where: {
        propertyId: propertyId,
      },
      include: {
        user: true, // Include details about the user who made each bid
        property: true, // Include property details
        group: true, // Include group details associated with the bid
      },
    });

    if (bids.length > 0) {
      res.json(bids);
    } else {
      res.status(404).json({ message: "No bids found for this property" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export const removeBid = asyncHandler(async (req, res) => {
  const { bidId } = req.body;

  // First, verify that the bid exists
  const bid = await prisma.bid.findUnique({
    where: {
      id: bidId,
    },
  });

  if (!bid) {
    return res.status(404).json({ message: "Bid not found" });
  }

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

// Function to get all favorite properties for a user
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Received userId from the request body

  try {
    // Fetch the user with their favorited properties IDs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favResidenciesID: true }, // Selecting favorited property IDs
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has any favorited properties
    if (user.favResidenciesID.length === 0) {
      return res.status(200).json([]); // Return an empty array if no favorites
    }

    // Fetch the properties based on the IDs in favResidenciesID
    const favoritedProperties = await prisma.property.findMany({
      where: {
        id: {
          in: user.favResidenciesID,
        },
      },
      include: {
        images: true, // Including related images for each property
      },
    });

    res.status(200).json(favoritedProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
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


export const createGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const joinCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code

  try {
    await prisma.group.create({
      data: {
        joinCode,
        numberOfPeople: 1,
        users: {
          connect: [{ id: userId }]
        }
      }
    });

    // Fetch the group again to include users' details in the response
    const groupWithUsers = await prisma.group.findUnique({
      where: { joinCode },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePicUrl: true,
          },
        },
      },
    });

    res.status(200).json(groupWithUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const joinGroup = asyncHandler(async (req, res) => {
  const { userId, joinCode } = req.body;

  try {
    const group = await prisma.group.findUnique({
      where: { joinCode }
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Existing check if user is already in a group logic...

    // Add user to the group
    await prisma.user.update({
      where: { id: userId },
      data: { groupId: group.id },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const remainingUsers = await prisma.user.count({
      where: { groupId: user.groupId },
    });

    await prisma.group.update({
      where: { id: user.groupId },
      data: {
        numberOfPeople: remainingUsers,
      },
    });


    // Fetch the updated group to include all users' details in the response
    const updatedGroupWithUsers = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePicUrl: true,
          },
        },
      },
    });

    res.status(200).json(updatedGroupWithUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const groups = await prisma.group.findMany({
      where: {
        users: {
          some: {
            id: {
              equals: userId
            }
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePicUrl: true,
          },
        },
      },
    });

    // Since a userID is associated with only one group, take the first element
    const group = groups[0]; // Take the first group from the result

    if (!group) {
      //return res.status(405).json({ message: "No group found for this user" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export const leaveGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user exists and is part of a group
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.groupId) {
      return res.status(404).json({ message: "User not found or not in a group" });
    }

    // Remove user from the group by setting groupId to null
    await prisma.user.update({
      where: { id: userId },
      data: { groupId: null },
    });

    // Check if the group has any remaining users
    const remainingUsers = await prisma.user.count({
      where: { groupId: user.groupId },
    });

    if (remainingUsers === 0) {
      // If no more users in the group, delete the group
      await prisma.group.delete({
        where: { id: user.groupId },
      });
    } else {
      // If there are still users, update the numberOfPeople in the group
      await prisma.group.update({
        where: { id: user.groupId },
        data: {
          numberOfPeople: remainingUsers,
        },
      });
    }

    res.status(200).json({ message: "Left the group successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

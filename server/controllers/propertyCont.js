import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createProperty = asyncHandler(async (req, res) => {
  const {
    title, description, price, address, city, country, facilities, userId,
    deadline, availableRooms // Include availableRooms in the destructured request body
  } = req.body;
  const images = req.files;

  try {
    const parsedDeadline = new Date(deadline);
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseInt(price, 10),
        address,
        city,
        country,
        facilities: JSON.parse(facilities),
        deadline: parsedDeadline,
        availableRooms: parseInt(availableRooms, 10), // Save availableRooms as an integer
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    let imageDescriptions = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const descriptionKey = `imageDescription-${i}`;
        const descriptionValue = req.body[descriptionKey];
        if (descriptionValue) {
          imageDescriptions.push(descriptionValue);
        } else {
          throw new Error(`Description for image ${i + 1} is missing.`);
        }
      }
    }

    if (images && images.length > 0 && imageDescriptions.length === images.length) {
      const imageRecords = images.map((image, index) => ({
        url: image.location,
        description: imageDescriptions[index],
        propertyId: property.id,
      }));

      await prisma.image.createMany({
        data: imageRecords,
      });
    } else {
      throw new Error(`Images and descriptions count mismatch. Images count: ${images.length}, Descriptions count: ${imageDescriptions.length}.`);
    }

    res.send({ message: "Property created successfully", propertyId: property.id });
  } catch (err) {
    if (err.code === "P2002") {
      res.status(400).send({ message: "A property with the given address already exists." });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
});



// Function to get all the properties along with their images
export const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true, // Include the images relation
    },
  });
  res.send(properties);
});

// function to get a specific document/property
export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id: id, },
    });
    res.send(property);
  } catch (err) {
    throw new Error(err.message);
  }
});


export const getPropertiesByLandlord = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const properties = await prisma.property.findMany({
      where: {
        userId: userId,
      },
      include: {
        images: true,
      },
    });

    res.json(properties);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


export const patchProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.id; // Get the user ID from the authenticated user added by the protect middleware

  try {
    // First, find the property to ensure it exists and to check the owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    // If property does not exist
    if (!property) {
      return res.status(404).send({ message: "Property not found." });
    }

    // Check if the authenticated user is the owner of the property
    if (property.userId !== userId) {
      return res.status(403).send({ message: "User not authorized to update this property." });
    }

    // If the user is authorized, proceed with the update
    const updateData = Object.entries(req.body).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Check if `facilities` is a string and parse it into an object
    if (typeof updateData.facilities === 'string') {
      updateData.facilities = JSON.parse(updateData.facilities);
    }

    if (updateData.price) updateData.price = parseFloat(updateData.price);

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    res.json({ message: "Property updated successfully", property: updatedProperty });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

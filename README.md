# HaggeleHouse - The Student Rental App.

HaggleHouse is a web application designed to simplify finding, managing, and negotiating student rental properties. Developed as part of a final year project at the University of Liverpool for a BSc in Computer Science, this application aims to address a critical gap in the market where 63% of students find it hard or very hard to find affordable accommodation (2023).

Deployed live on : [hagglehouse.ebinsabu.com](http://hagglehouse.ebinsabu.com)

## Key Features

#### User Registration and Authentication
- Users can create accounts and log in securely
- User roles are defined, distinguishing between students and landlords

#### Property Listing
- Landlords can list rental properties with details like location, price, availability, and property features
- Students can search and view property listings without registration

#### Search and Filter Functionality
- Students can search for properties based on location, price range, property type, and other relevant filters

#### Real-Time Messaging
- Students and landlords can communicate in real time, facilitating questions, negotiations, and property inquiries
- Notifications for new messages and property updates are available

#### Price Negotiation
- Students can submit offers on rental properties
- Landlords can respond with counteroffers
- Negotiation history is maintained

#### Responsive Design
- The web application is responsive, ensuring a seamless user experience on various devices and screen sizes

#### Custom Backend API
- A custom backend API is developed for handling data storage, retrieval, and user authentication
- The API supports real-time messaging and price negotiation functionality

#### User Profiles
- Users can create and manage profiles with preferences and contact details

#### Intuitive Search
- A prominent search bar allows users to quickly enter their preferences, with auto-suggestions for effortless search

#### Property Cards
- Property listings are displayed as clean, concise cards, featuring high-quality images, pricing information, and essential details

## Technology Stack

HaggleHouse is built using the MERN (MongoDB, Express, React, Node.js) stack and incorporates a custom API for backend operations, including:

- Data storage and retrieval
- User authentication
- Real-time communication between users and landlords

The API plays a crucial role in managing data flow and ensuring security within the application.

## Motivation

While many apps are designed to help students find accommodation, none enable them to negotiate with landlords effectively. HaggleHouse aims to bridge this gap by providing a platform where students can easily search for properties, submit offers, and communicate with landlords in real-time.

With its user-friendly interfaces and location-based search capabilities, HaggleHouse simplifies the process of finding and securing student rental properties, addressing the challenges faced by a significant portion of the student population.

## Setup

To run the HaggleHouse application, follow these steps:

1. Open a terminal and navigate to the `server` directory:
   ```
   cd server
   ```
   Then, install the dependencies and start the server:
   ```
   npm install
   npm run dev
   ```

2. Open another terminal and navigate to the `frontend` directory:
   ```
   cd frontend
   ```
   Then, install the dependencies and start the client:
   ```
   npm install
   npm start
   ```

The HaggleHouse application should now be running locally on [http://localhost:3000](http://localhost:3000), and you can access it through your web browser.


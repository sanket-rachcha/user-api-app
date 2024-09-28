import React, { useState, useEffect } from "react"; // Import React, useState for state management, and useEffect for side effects like API calls
import axios from "axios"; // Import axios for making HTTP requests

const App = () => {
  // Declare a state variable 'users' to store the list of users and 'selectedUser' to store the selected user
  const [users, setUsers] = useState([]); // users: array of all users
  const [selectedUser, setSelectedUser] = useState(() => {
    // Check if there is a saved user in localStorage and parse it. If not, default to null
    const savedUser = localStorage.getItem("selectedUser");
    return savedUser ? JSON.parse(savedUser) : null; // Return the saved user from localStorage if available
  });

  // Fetch users from the API when the component is first rendered (on mount)
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users") // Make a GET request to fetch all users
      .then((response) => {
        setUsers(response.data); // On success, update the 'users' state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Log any error that occurs during the fetch
      });
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // Save the selected user to localStorage whenever 'selectedUser' state changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser)); // Store the selected user in localStorage
    }
  }, [selectedUser]); // Run this effect whenever 'selectedUser' changes

  // Function to handle user selection from the dropdown
  const handleSelectUser = (id) => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${id}`) // Make a GET request to fetch details of the selected user by id
      .then((response) => {
        setSelectedUser(response.data); // On success, update 'selectedUser' state with the fetched user data
      })
      .catch((error) => {
        console.error("Error fetching user details:", error); // Log any error that occurs during the fetch
      });
  };

  // Function to determine the geographical location and assign appropriate color and text based on latitude and longitude
  const renderLocationBox = () => {
    if (!selectedUser) return "User not selected"; // If no user is selected, return this message

    // Destructure latitude (lat) and longitude (lng) from the selected user's address
    const {
      address: {
        geo: { lat, lng },
      },
    } = selectedUser;
    let locationPhrase = ""; // String to hold the location phrase (e.g., North and West)
    let colorClass = ""; // String to hold the Tailwind class for background color

    // Determine location phrase and color class based on lat/lng
    if (lat > 0 && lng > 0) {
      locationPhrase = "North and West"; // Latitude > 0, Longitude > 0
      colorClass = "bg-orange-400"; // Orange background for North and West
    } else if (lat > 0 && lng < 0) {
      locationPhrase = "North and East"; // Latitude > 0, Longitude < 0
      colorClass = "bg-purple-400"; // Purple background for North and East
    } else if (lat < 0 && lng > 0) {
      locationPhrase = "South and West"; // Latitude < 0, Longitude > 0
      colorClass = "bg-green-400"; // Green background for South and West
    } else if (lat < 0 && lng < 0) {
      locationPhrase = "South and East"; // Latitude < 0, Longitude < 0
      colorClass = "bg-red-400"; // Red background for South and East
    }

    // Return a div with the appropriate color class and location phrase
    return (
      <div className={`p-4 text-white ${colorClass}`}>{locationPhrase}</div>
    );
  };

  return (
    <div className="h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center h-24 bg-gray-200 px-8">
        <div className="w-1/3">
          {/* Dropdown */}
          <div className="relative">
            <select
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded"
              onChange={(e) => handleSelectUser(e.target.value)} // Handle dropdown change event by selecting a user
            >
              <option value="">Select User</option>{" "}
              {/* Default option when no user is selected */}
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option> // Populate dropdown with user names from the 'users' state
              ))}
            </select>
          </div>
        </div>
        <div className="w-1/3 text-right">
          {/* Selected User Info */}
          <div className="bg-blue-500 text-white p-4 rounded">
            {/* Display selected user's name and ID, or 'User not selected' if no user is selected */}
            {selectedUser
              ? `${selectedUser.name} (id: ${selectedUser.id})`
              : "User not selected"}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between h-full p-8">
        {/* Empty Left Box */}
        <div className="w-1/3 bg-gray-100"></div>

        {/* Right Box with Location Info */}
        <div className="w-2/3 bg-gray-100">
          {renderLocationBox()}{" "}
          {/* Render the location info box based on the selected user's lat/lng */}
        </div>
      </div>
    </div>
  );
};

export default App; // Export the App component as the default export

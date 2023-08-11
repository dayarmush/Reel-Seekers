# Reel Seekers Fishing Spot Finder - README

Welcome to Reel Seekers, your ultimate platform for discovering and sharing fishing spots, learning about various fish species, and engaging with the angling community. Reel Seekers is designed to provide you with a user-friendly experience as you explore fishing locations, contribute your own discoveries, and connect with fellow fishing enthusiasts. Please read this README to acquaint yourself with the app's features, installation process, and usage guidelines.

## Features

1. **Easy Exploration:** Discover fishing spots near your location or any specified address, and access comprehensive information about each lake's attributes, available fish species, user reviews, and dedicated message board.

2. **Fish Species Encyclopedia:** Delve into a wealth of knowledge about different fish species, including their characteristics, habitats, and recommended fishing techniques.

3. **User Reviews and Ratings:** Share your personal experiences by writing reviews and assigning ratings to fishing spots you've visited. Benefit from the insights and opinions of other anglers.

4. **Lake-Specific Message Boards:** Engage in lake-specific discussions by accessing message boards dedicated to each fishing spot. Connect with other users, exchange tips, and share stories.

5. **Integrated Google Maps:** Seamlessly obtain directions to fishing spots using the integrated Google Maps feature, ensuring smooth trip planning.

6. **User Contributions and Approvals:** Registered users can contribute by adding new fishing spots and fish species. All submissions are carefully reviewed and approved by the site admin.

7. **User Authentication and Security:** User passwords are protected using bcrypt hashing and salting methods, ensuring security for your account.

8. **Session Management:** Enjoy a seamless experience with persistent login using sessions and cookies. You'll stay logged in even when you close your browser.

## Installation

1. **Clone the Repository:** Begin by cloning the repository to your local machine: `git clone https://github.com/your-username/reel-seekers.git`

2. **Install Dependencies:**
  - Navigate to the client directory and install React.js dependencies: `cd reel-seekers/client`,
  `npm install`
  - Navigate to the server directory with `cd ../server`, run `pipenv install`, `pipenv shell` to install Python Flask dependencies.
3. **Configure API Keys and Secret Keys:**

- Replace the placeholders for Google Maps API key and Rapid API fish species keys in the client's code.
- Set a secret key for session management in the server's configuration file.
- Configure the database URI to establish a connection with your chosen database.

4. **Run the App:**
   - Start the Python Flask backend: `python app.py`
   - Start the React.js frontend: `cd ../client`, `npm start`
  
## Usage
1. **Exploring Fishing Spots:** Utilize the search function to discover fishing spots based on your location or a specified address.

2. **Learning About Fish Species:** Explore the comprehensive fish species database to acquire knowledge about different fish types and their unique characteristics.

3. **User Reviews and Ratings:** Share your personal insights by writing reviews and assigning ratings to fishing spots you've had experiences with.

4. **Lake-Specific Message Boards:** Engage in discussions by accessing dedicated message boards for each fishing spot. Connect with fellow anglers and share valuable information.

5. **Connecting with the Community:** Interact with other users, build connections and enhance your fishing journey.

6. **Contributing to the App:** Registered users can contribute by adding new fishing spots and fish species to the app's database. Note that this feature requires logging in.

7. **Accessing Directions:** Seamlessly obtain directions to fishing spots using the integrated Google Maps feature.


## Contributing
We welcome contributions to enhance Reel Seekers. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or enhancement.
3. Make your changes, commit them, and push to your fork.
4. Submit a pull request to the main repository.

Please adhere to coding standards and ensure thorough testing.

## Feedback and Support
For feedback, assistance, or inquiries, create an issue in the GitHub repository.

Thank you for choosing Reel Seekers! Embark on exciting fishing adventures, share your experiences, and connect with fellow anglers through our feature-rich web app. Happy fishing!

   

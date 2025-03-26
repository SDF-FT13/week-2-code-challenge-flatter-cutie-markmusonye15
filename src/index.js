document.addEventListener("DOMContentLoaded", () => {
  const baseURL = "http://localhost:3000/characters";
  const characterBar = document.getElementById("character-bar");
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const votesInput = document.getElementById("votes");
  const addVotesButton = document.querySelector(
    "#votes-form input[type='submit']"
  );
  const resetButton = document.getElementById("reset-btn");
  const characterForm = document.getElementById("character-form");
  const characterNameInput = document.getElementById("character-name");
  const imageUrlInput = document.getElementById("image-url");

  let currentCharacter = null;

  // Fetch and display characters in the character bar
  fetch(baseURL)
    .then((response) => response.json())
    .then((characters) => {
      characters.forEach((character) => {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.classList.add("character-item");
        span.addEventListener("click", () => displayCharacter(character, span));
        characterBar.appendChild(span);
      });
    })
    .catch((error) => console.error("Error fetching characters:", error));

  // Function to display selected character details
  function displayCharacter(character, selectedElement) {
    currentCharacter = character;
    nameElement.textContent = character.name;
    imageElement.src = character.image;
    imageElement.alt = character.name;
    voteCountElement.textContent = character.votes;
    console.log(`Selected: ${character.name}, Votes: ${character.votes}`);

    // Highlight selected character
    document
      .querySelectorAll(".character-item")
      .forEach((item) => item.classList.remove("selected"));
    selectedElement.classList.add("selected");
  }

  // Handle votes submission
  votesForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    if (!currentCharacter) return;

    const newVotes = parseInt(votesInput.value) || 0; // Get the entered votes
    currentCharacter.votes += newVotes; // Update vote count
    voteCountElement.textContent = currentCharacter.votes; // Display updated votes
    console.log(`+${newVotes} votes for ${currentCharacter.name}`);
    votesInput.value = ""; // Clear input field

    // Update votes on server
    fetch(`${baseURL}/${currentCharacter.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes: currentCharacter.votes }),
    })
      .then((response) => response.json())
      .then((updatedCharacter) =>
        console.log("Votes updated on server:", updatedCharacter)
      )
      .catch((error) => console.error("Error updating votes:", error));
  });

  // Handle resetting votes
  resetButton.addEventListener("click", () => {
    if (!currentCharacter) return;
    currentCharacter.votes = 0; // Reset votes to zero
    voteCountElement.textContent = "0"; // Update UI
    console.log(`Votes reset for ${currentCharacter.name}`);

    // Reset votes on server
    fetch(`${baseURL}/${currentCharacter.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes: 0 }),
    })
      .then((response) => response.json())
      .then((updatedCharacter) =>
        console.log("Votes reset on server:", updatedCharacter)
      )
      .catch((error) => console.error("Error resetting votes:", error));
  });

  // Handle new character submission
  characterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = characterNameInput.value.trim();
    const newImage = imageUrlInput.value.trim();

    if (!newName || !newImage) {
      alert("Please enter both a name and an image URL.");
      return;
    }

    const newCharacter = {
      name: newName,
      image: newImage,
      votes: 0,
    };

    // Save new character to server
    fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    })
      .then((response) => response.json())
      .then((savedCharacter) => {
        // Add character to UI
        const span = document.createElement("span");
        span.textContent = savedCharacter.name;
        span.classList.add("character-item");
        span.addEventListener("click", () =>
          displayCharacter(savedCharacter, span)
        );
        characterBar.appendChild(span);
        console.log("New character added and saved to server:", savedCharacter);
      })
      .catch((error) => console.error("Error adding character:", error));

    // Clear input fields
    characterNameInput.value = "";
    imageUrlInput.value = "";
  });
});

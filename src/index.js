Document.addEventListener("DOMContentLoaded"),
  () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCountElement = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");

    let currentCharacter = null;

    // Fetch and display characters in the character bar
    fetch(baseURL)
      .then((response) => response.json())
      .then((characters) => {
        characters.forEach((character) => {
          const span = document.createElement("span");
          span.textContent = character.name;
          span.addEventListener("click", () => displayCharacter(character));
          characterBar.appendChild(span);
        });
      })
      .catch((error) => console.error("Error fetching characters:", error));
  };

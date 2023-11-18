document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("game-area");
  const character = document.getElementById("character");
  let isMoving = false;

  function moveCharacter(targetX, targetY) {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const characterWidth = character.offsetWidth;
    const characterHeight = character.offsetHeight;

    // Allow the character to move to the full width and height of the game area
    targetX = Math.max(
      0,
      Math.min(targetX, gameAreaRect.width - characterWidth)
    );
    targetY = Math.max(
      0,
      Math.min(targetY, gameAreaRect.height - characterHeight)
    );

    const characterX = character.offsetLeft;
    const characterY = character.offsetTop;

    const distance = Math.sqrt(
      Math.pow(targetX - characterX, 2) + Math.pow(targetY - characterY, 2)
    );
    const speed = 2;
    const steps = Math.round(distance / speed);

    const dx = (targetX - characterX) / steps;
    const dy = (targetY - characterY) / steps;

    targetPosition.x = targetX;
    targetPosition.y = targetY;
    targetPosition.dx = dx;
    targetPosition.dy = dy;
    remainingSteps = steps;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updatePosition);
    }
  }

  let remainingSteps = 0;
  const targetPosition = { x: 0, y: 0 };

  function updatePosition() {
    if (remainingSteps > 0) {
      character.style.left = `${character.offsetLeft + targetPosition.dx}px`;
      character.style.top = `${character.offsetTop + targetPosition.dy}px`;
      remainingSteps--;

      updateWalkingAnimation();
      requestAnimationFrame(updatePosition);
    } else {
      resetWalkingAnimation();
      isMoving = false;
    }

    // Check for reaching skills or interests
    document.querySelectorAll(".skill, .interest").forEach((element) => {
      if (isElementReached(character, element)) {
        onSkillInterestReached(element.id);
      }
    });
  }

  function isElementReached(character, element) {
    const characterRect = character.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return (
      characterRect.left < elementRect.right &&
      characterRect.right > elementRect.left &&
      characterRect.top < elementRect.bottom &&
      characterRect.bottom > elementRect.top
    );
  }

  function showInfoWindow(title, text) {
    const infoWindow = document.getElementById("info-window");
    document.getElementById("info-title").textContent = title;
    document.getElementById("info-text").textContent = text;

    infoWindow.classList.remove("hidden");
  }

  function onSkillInterestReached(elementId) {
    switch (elementId) {
      case "skill-cloud":
        showInfoWindow(
          "🧑‍💻Programming",
          "I am a passionate Software Engineer who loves learning new technologies and constantly learn. I love studying programming languages as well as making projects."
        );
        break;
      case "skill-security":
        showInfoWindow(
          "🔐Cybersecurity",
          "Passionate about cyber security and cyber threats. I love learning Malware behavior and reverse engineering as well as security of data."
        );
        break;
      case "interest-guitar":
        showInfoWindow(
          "🎸Guitar",
          "On my free time, I love to practice and play guitar. I like learning new songs and new chord on the guitar. My guitar is the reason why I dont stress out"
        );
        break;
      // ... other cases ...
    }
  }

  gameArea.addEventListener("click", (event) => {
    const rect = gameArea.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    moveCharacter(clickX, clickY);
  });

  let animationFrame = 0;
  const totalFrames = 4; // Adjust based on your sprite sheet

  function updateWalkingAnimation() {
    const frameWidth = 100 / totalFrames;
    const newBackgroundPosition = -(animationFrame * frameWidth) + "%";
    character.style.backgroundPosition = `${newBackgroundPosition} 0`;

    animationFrame = (animationFrame + 1) % totalFrames;
  }

  function resetWalkingAnimation() {
    character.style.backgroundPosition = "0 0";
    animationFrame = 0;
  }
});

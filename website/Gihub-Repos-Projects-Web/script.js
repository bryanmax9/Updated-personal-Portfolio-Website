document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "../index.html";
  });

  const username = "bryanmax9"; // Replace with your GitHub username
  let currentPage = 1;
  const perPage = 10; // GitHub API maximum is 100

  const fetchLanguages = (repo) => {
    return fetch(repo.languages_url)
      .then((response) => response.json())
      .then((languages) => {
        return Object.keys(languages).join(", ");
      });
  };

  const fetchRepos = (page) => {
    const apiUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(async (data) => {
        const projectList = document.getElementById("project-list");
        projectList.innerHTML = ""; // Clear current list

        for (const repo of data) {
          const languages = await fetchLanguages(repo);
          const listItem = document.createElement("li");
          listItem.innerHTML = `
                      <strong>${repo.name}</strong>
                      <div>Programming Languages: ${languages}</div>
                      <p>${repo.description || "No description"}</p>
                      <a href="${
                        repo.html_url
                      }" target="_blank">View on GitHub</a>
                  `;
          projectList.appendChild(listItem);
        }
      })
      .catch((error) => {
        console.error("Fetching GitHub repos failed:", error);
      });
  };

  document.getElementById("next").addEventListener("click", () => {
    currentPage += 1;
    fetchRepos(currentPage);
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      fetchRepos(currentPage);
    }
  });

  fetchRepos(currentPage); // Initial fetch
});

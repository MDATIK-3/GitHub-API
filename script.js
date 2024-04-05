
function searchUser() {
    const input = document.getElementById("searchInput").value.trim();
    if (!input) {
        alert("Please enter a GitHub username");
        return;
    }

    let apiUrl;
    if (/^\S+@\S+\.\S+$/.test(input)) {
        apiUrl = `https://api.github.com/search/users?q=${input}+in:email`;
    } else {
        apiUrl = `https://api.github.com/users/${input}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(userData => {
            const userDataHtml = `
                <div class="mt-8">
                    <div class="flex items-center space-x-4">
                        <img src="${userData.avatar_url}" alt="${userData.name || userData.login}" class="w-20 h-20 rounded-full">
                        <div>
                            <h2 class="text-2xl font-semibold">${userData.name || userData.login}</h2>
                            <p class="text-gray-600">@${userData.login}</p>
                        </div>
                    </div>
                    <p class="mt-4 text-gray-700">${userData.bio || "No bio provided"}</p>
                    <div class="mt-4">
                        <span class="mr-4">
                            <i class="fas fa-users"></i> <a href="https://github.com/${userData.login}?tab=followers" class="text-black">  ${userData.followers} followers</a>
                        </span>
                        <span>
                            <i class="fas fa-user-friends"></i> <a href="https://github.com/${userData.login}?tab=following" class="text-black">  ${userData.following} following</a>
                                                  </span>
                    </div>
                    <div class="mt-4">
                        <i class="fas fa-map-marker-alt"></i> ${userData.location || "Location not provided"}
                    </div>
                    <div class="mt-4">
                        <i class="fas fa-book"></i> ${userData.public_repos} public repositories
                    </div>
                </div>
            `;
            document.getElementById("userData").innerHTML = userDataHtml;

            // Fetch repositories
            const githubReposUrl = `https://api.github.com/users/${input}/repos`;
            return fetch(githubReposUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(reposData => {
            const reposHtml = `
                <div class="mt-8">
                    <h2 class="text-xl font-semibold mb-4">Repositories</h2>
                    <ul class="list-disc list-inside">
                        ${reposData.map(repo => `<li><a href="${repo.html_url}" class="text-blue-500">${repo.name}</a></li>`).join('')}
                    </ul>
                </div>
            `;
            document.getElementById("repositories").innerHTML = reposHtml;

            // Fetch contribution chart
            const ghChartUrl = `https://ghchart.rshah.org/${input}`;
            const contributionsChartHtml = `
                <div class="mt-8">
                    <img src="${ghChartUrl}" alt="GitHub Contributions" class="mx-auto">
                </div>
            `;
            document.getElementById("contributionsChart").innerHTML = contributionsChartHtml;
        })

}
window.onload = function () {
    document.getElementById("searchInput").value = "";
};
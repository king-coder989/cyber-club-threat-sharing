const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; 
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getThreat",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getThreatsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_anonymousId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_threatType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_threatValue",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_clubTag",
				"type": "string"
			}
		],
		"name": "submitThreat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "threats",
		"outputs": [
			{
				"internalType": "string",
				"name": "anonymousId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "threatType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "threatValue",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "clubTag",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "voteThreat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; 

async function init() {
    // Check if ethers.js loaded
    if (typeof ethers === "undefined") {
        showError("Failed to load ethers.js library. Please refresh the page or check your internet connection.");
        return;
    }

    // Check for MetaMask
    if (!window.ethereum) {
        showError("Please install MetaMask to use this app!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
        console.log("Requesting MetaMask connection...");
        await provider.send("eth_requestAccounts", []);
        console.log("MetaMask connected successfully");
    } catch (error) {
        console.error("MetaMask connection error:", error);
        showError("Failed to connect to MetaMask: " + error.message);
        return;
    }

    // Verify network
    const network = await provider.getNetwork();
    console.log("Connected to network:", network);
    if (network.chainId !== 11155111) { // Sepolia chain ID
        showError("Please switch MetaMask to the Sepolia testnet!");
        return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Generate and display club code
    const clubCode = generateClubCode();
    const clubCodeDisplay = document.createElement("div");
    clubCodeDisplay.style.color = "#00ccff";
    clubCodeDisplay.style.margin = "10px 0";
    clubCodeDisplay.textContent = `Club Code (share with members): ${clubCode}`;
    document.getElementById("threatForm").prepend(clubCodeDisplay);

    // Show app content
    document.getElementById("loadingMessage").style.display = "none";
    document.getElementById("appContent").style.display = "block";

    // Validate and submit threat
    document.getElementById("threatForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get form values
        const clubCodeInput = document.getElementById("clubCode").value.trim();
        const userId = document.getElementById("userId").value.trim();
        const threatType = document.getElementById("threatType").value.trim();
        const threatValue = document.getElementById("threatValue").value.trim();
        const description = document.getElementById("description").value.trim();
        const clubTag = document.getElementById("clubTag").value.trim();

        // Validate club code
        if (clubCodeInput !== clubCode) {
            showError("Invalid club code! Use the code provided above.");
            return;
        }

        // Validation
        if (!userId || !threatType || !threatValue || !description || !clubTag) {
            showError("All fields are required!");
            return;
        }
        if (threatType.length > 50 || threatValue.length > 100 || description.length > 200 || clubTag.length > 50) {
            showError("Input exceeds maximum length!");
            return;
        }
        if (!/^[a-zA-Z0-9\s.,-]+$/.test(threatType) || !/^[a-zA-Z0-9\s.,-]+$/.test(clubTag)) {
            showError("Threat Type and Club Tag can only contain letters, numbers, spaces, dots, commas, or hyphens!");
            return;
        }

        // Show loading state
        const submitButton = document.querySelector("#threatForm button");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            const hashedUserId = ethers.utils.sha256(ethers.utils.toUtf8Bytes(userId));
            console.log("Submitting threat with:", { hashedUserId, threatType, threatValue, description, clubTag });
            const tx = await contract.submitThreat(hashedUserId, threatType, threatValue, description, clubTag);
            console.log("Transaction sent:", tx.hash);
            await tx.wait();
            console.log("Transaction confirmed");
            showSuccess("Threat submitted successfully!");
            document.getElementById("threatForm").reset();
            await loadThreats();
        } catch (error) {
            console.error("Submission error:", error);
            showError("Error submitting threat: " + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Threat";
        }
    });

    // Refresh button handler
    document.getElementById("refreshButton").addEventListener("click", async () => {
        const refreshButton = document.getElementById("refreshButton");
        refreshButton.disabled = true;
        refreshButton.textContent = "Refreshing...";
        try {
            await loadThreats();
        } finally {
            refreshButton.disabled = false;
            refreshButton.textContent = "Refresh Threats";
        }
    });

    // Load threats
    async function loadThreats() {
        const threatsBody = document.getElementById("threatsBody");
        threatsBody.innerHTML = "<tr><td colspan='8'>Loading threats...</td></tr>";
        try {
            console.log("Fetching threats count...");
            const count = await contract.getThreatsCount();
            console.log("Threats count:", count.toString());
            threatsBody.innerHTML = "";
            if (count == 0) {
                threatsBody.innerHTML = "<tr><td colspan='8'>No threats found.</td></tr>";
                return;
            }
            for (let i = 0; i < count; i++) {
                console.log(`Fetching threat at index ${i}...`);
                const threat = await contract.getThreat(i);
                console.log("Threat data:", threat);
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${threat[0].slice(0, 10)}...</td>
                    <td>${threat[1]}</td>
                    <td>${threat[2]}</td>
                    <td>${threat[3]}</td>
                    <td>${threat[4]}</td>
                    <td>${new Date(threat[5] * 1000).toLocaleString()}</td>
                    <td>${threat[6]}</td>
                    <td><button onclick="vote(${i})">Vote</button></td>
                `;
                threatsBody.appendChild(row);
            }
        } catch (error) {
            console.error("Error loading threats:", error);
            showError("Error loading threats: " + error.message);
            threatsBody.innerHTML = "<tr><td colspan='8'>Failed to load threats. Try refreshing.</td></tr>";
        }
    }

    // Vote for a threat
    window.vote = async (index) => {
        const voteButton = event.target;
        voteButton.disabled = true;
        voteButton.textContent = "Voting...";
        try {
            const tx = await contract.voteThreat(index);
            await tx.wait();
            showSuccess("Vote recorded!");
            await loadThreats();
        } catch (error) {
            console.error("Voting error:", error);
            showError("Error voting: " + error.message);
        } finally {
            voteButton.disabled = false;
            voteButton.textContent = "Vote";
        }
    };

    // Helper functions for user feedback
    function showError(message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        // If form isn't visible, append to body; otherwise, prepend to form
        const form = document.getElementById("threatForm");
        if (form && form.offsetParent !== null) {
            form.prepend(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }
        setTimeout(() => errorDiv.remove(), 5000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement("div");
        successDiv.style.color = "#55ff55";
        successDiv.style.margin = "10px 0";
        successDiv.textContent = message;
        document.getElementById("threatForm").prepend(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
    }

    // Generate a random club code
    function generateClubCode() {
        const prefix = "CYBERCLUB";
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        const code = `${prefix}${randomNum}`;
        console.log("Generated club code:", code);
        return code;
    }

    // Initial load
    await loadThreats();
}

init();

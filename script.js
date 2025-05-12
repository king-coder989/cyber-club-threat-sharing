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
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Validate and submit threat
    document.getElementById("threatForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get form values
        const userId = document.getElementById("userId").value.trim();
        const threatType = document.getElementById("threatType").value.trim();
        const threatValue = document.getElementById("threatValue").value.trim();
        const description = document.getElementById("description").value.trim();
        const clubTag = document.getElementById("clubTag").value.trim();

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
            const tx = await contract.submitThreat(hashedUserId, threatType, threatValue, description, clubTag);
            await tx.wait();
            showSuccess("Threat submitted successfully!");
            document.getElementById("threatForm").reset(); // Clear form
            await loadThreats(); // Refresh table
        } catch (error) {
            showError("Error submitting threat: " + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Threat";
        }
    });

    // Load threats
    async function loadThreats() {
        const threatsBody = document.getElementById("threatsBody");
        threatsBody.innerHTML = "<tr><td colspan='8'>Loading threats...</td></tr>";
        try {
            const count = await contract.getThreatsCount();
            threatsBody.innerHTML = ""; // Clear loading message
            if (count == 0) {
                threatsBody.innerHTML = "<tr><td colspan='8'>No threats found.</td></tr>";
                return;
            }
            for (let i = 0; i < count; i++) {
                const threat = await contract.getThreat(i);
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
            showError("Error loading threats: " + error.message);
            threatsBody.innerHTML = "<tr><td colspan='8'>Failed to load threats.</td></tr>";
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
            showError("Error voting: " + error.message);
        } finally {
            voteButton.disabled = false;
            voteButton.textContent = "Vote";
        }
    };

    // Helper functions for user feedback
    function showError(message) {
        const errorDiv = document.createElement("div");
        errorDiv.style.color = "#ff5555";
        errorDiv.style.margin = "10px 0";
        errorDiv.textContent = message;
        document.getElementById("threatForm").prepend(errorDiv);
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

    // Initial load
    await loadThreats();
}

init();

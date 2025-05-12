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

    // Submit threat
    document.getElementById("threatForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = ethers.utils.sha256(ethers.utils.toUtf8Bytes(document.getElementById("userId").value));
        const threatType = document.getElementById("threatType").value;
        const threatValue = document.getElementById("threatValue").value;
        const description = document.getElementById("description").value;
        const clubTag = document.getElementById("clubTag").value;

        try {
            const tx = await contract.submitThreat(userId, threatType, threatValue, description, clubTag);
            await tx.wait();
            alert("Threat submitted!");
            loadThreats();
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // Load threats
    async function loadThreats() {
        const threatsBody = document.getElementById("threatsBody");
        threatsBody.innerHTML = "";
        const count = await contract.getThreatsCount();
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
    }

    // Vote for a threat
    window.vote = async (index) => {
        try {
            const tx = await contract.voteThreat(index);
            await tx.wait();
            alert("Vote recorded!");
            loadThreats();
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    loadThreats();
}

init();

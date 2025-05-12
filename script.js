const contractAddress = "YOUR_CONTRACT_ADDRESS"; 
const abi = YOUR_CONTRACT_ABI; 

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

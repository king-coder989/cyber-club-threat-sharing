Cyber Club Threat Sharing Platform
A decentralized platform for anonymously sharing and voting on cyber threats within our college cyber club.
Features

Submit threats (e.g., malicious IPs, phishing URLs) with club-specific tags.
Anonymous submissions (user IDs are hashed).
Vote on credible threats.
Tamper-proof storage using Ethereum blockchain (Sepolia testnet).
Minimal, unpolished frontend hosted on Vercel.

Uniqueness

Club-focused: Tags threats relevant to our college (e.g., "uni_phish").
Blockchain-based: Ensures data integrity and anonymity.
Voting system: Members can mark credible threats.

Setup

Open the deployed site: https://cyber-club-threat-sharing.vercel.app
Connect MetaMask (Sepolia testnet, get test Ether from a faucet).
Submit and view threats via the web interface.

Development

Smart Contract: Written in Solidity, deployed via Remix IDE to Sepolia.
Frontend: HTML/JavaScript with ethers.js, hosted on Vercel.
Repository: All code managed on GitHub.

Limitations

Requires MetaMask and test Ether.
with Basic UI 
Gas costs for submissions/votes (free on testnet).

Demo Instructions

Submit a threat (e.g., phishing URL with "uni_phish" tag).
View the threat in the table (anonymous ID displayed).
Vote on a threat and verify the count updates.


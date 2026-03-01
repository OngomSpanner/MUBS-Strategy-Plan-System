const axios = require('axios');

async function testAdminProposals() {
    try {
        console.log("Testing GET /api/committees implementation...");

        // Simulating the login to get a valid token for the test
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@mubs.ac.ug',
            password: 'admin'
        });

        const token = loginRes.data.token;
        if (!token) throw new Error("Could not get auth token");

        console.log("Successfully authenticated as admin.");

        // Call the committees API
        const getRes = await axios.get('http://localhost:3000/api/committees', {
            headers: {
                Cookie: `token=${token}; active_role=System Administrator`
            }
        });

        console.log("\n--- Admin Committee API Output ---");
        console.log(`Found ${getRes.data.length} proposals.`);

        if (getRes.data.length > 0) {
            console.log("\nFirst Proposal Sample (Checking mapping format for UI):");
            console.log(JSON.stringify(getRes.data[0], null, 2));

            // Test the PATCH endpoint to approve this exact proposal
            const testId = getRes.data[0].id;
            console.log(`\nTesting PATCH /api/committees/${testId} (Approval)...`);

            const patchRes = await axios.patch(`http://localhost:3000/api/committees/${testId}`, {
                status: 'Approved',
                reviewer_notes: 'Auto-approved by backend verification test'
            }, {
                headers: {
                    Cookie: `token=${token}; active_role=System Administrator`
                }
            });

            console.log("Patch Result:", patchRes.data.message);

            // Fetch again to verify status change
            const verifyRes = await axios.get('http://localhost:3000/api/committees', {
                headers: {
                    Cookie: `token=${token}; active_role=System Administrator`
                }
            });

            const updatedProposal = verifyRes.data.find((p: any) => p.id === testId);
            console.log(`\nVerification: New Status is '${updatedProposal?.status}'`);

        } else {
            console.log("No pending proposals found to test. Verify Step 1 created them.");
        }

    } catch (e: any) {
        console.error("Test Error:", e.response ? e.response.data : e.message);
    }
}

testAdminProposals();

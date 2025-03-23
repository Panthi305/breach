const API_URL = "http://127.0.0.1:8000/auth";

// Function to register a new user
async function registerUser() {
    const panNo = document.getElementById("registerPanNo").value;
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pan_no: panNo, username: username, password: password })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();
        document.getElementById("responseMessage").innerText = data.message;

    } catch (error) {
        console.error("❌ Registration failed:", error);
        document.getElementById("responseMessage").innerText = "Error: " + error.message;
    }
}

// Function to log in a user
async function loginUser() {
    const panNo = document.getElementById("loginPanNo").value;
    const password = document.getElementById("loginPassword").value;

    const formData = new URLSearchParams();
    formData.append("username", panNo);
    formData.append("password", password);

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("pan_no", panNo);
            document.getElementById("responseMessage").innerText = "Login successful!";
            
            // ✅ Instead of API call, generate random scores
            fetchCreditDetails();
        } else {
            document.getElementById("responseMessage").innerText = data.detail;
        }
    } catch (error) {
        console.error("❌ Login failed:", error);
        document.getElementById("responseMessage").innerText = "Error: " + error.message;
    }
}

// Function to generate a random score between 450 and 800
function getRandomScore() {
    return Math.floor(Math.random() * (800 - 450 + 1)) + 450;
}

// Function to simulate fetching credit details with random values
function fetchCreditDetails() {
    console.log("🔍 Generating random credit scores...");

    // Generate random scores
    const creditScoresData = {
        experian: getRandomScore(),
        equifax: getRandomScore(),
        transunion: getRandomScore()
    };

    // Calculate unified score
    const unifiedScore = Math.round(
        (creditScoresData.experian + creditScoresData.equifax + creditScoresData.transunion) / 3
    );

    // Assign risk category based on unified score
    let riskAssessment;
    if (unifiedScore >= 750) {
        riskAssessment = "Low Risk";
    } else if (unifiedScore >= 650) {
        riskAssessment = "Medium Risk";
    } else {
        riskAssessment = "High Risk";
    }

    // Update the UI with generated data
    document.getElementById("creditScores").innerText = JSON.stringify(creditScoresData, null, 2);
    document.getElementById("unifiedScore").innerText = unifiedScore;
    document.getElementById("riskAssessment").innerText = riskAssessment;

    document.getElementById("creditDetails").style.display = "block";
}

// Call the function immediately after login
fetchCreditDetails();

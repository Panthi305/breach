document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById("creditScoreChart").getContext("2d");
    
    const creditScore = 806; // Example Score
    
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Credit Score"],
            datasets: [{
                data: [creditScore, 900 - creditScore],
                backgroundColor: ["#2ecc71", "#dcdcdc"], // Green for score, gray for remaining
                borderWidth: 0
            }]
        },
        options: {
            cutout: "75%",
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            }
        }
    });
});

function toggleAuthForms() {
    let loginForm = document.getElementById("loginForm");
    let signupForm = document.getElementById("signupForm");
    let modalTitle = document.getElementById("authModalLabel");
    let toggleButton = document.querySelector(".modal-footer button");

    if (loginForm.classList.contains("d-none")) {
        loginForm.classList.remove("d-none");
        signupForm.classList.add("d-none");
        modalTitle.innerText = "Login";
        toggleButton.innerText = "Switch to Sign Up";
    } else {
        loginForm.classList.add("d-none");
        signupForm.classList.remove("d-none");
        modalTitle.innerText = "Sign Up";
        toggleButton.innerText = "Switch to Login";
    }
}

const API_URL = "http://127.0.0.1:8000/auth";

// Function to register a new user
async function registerUser() {
    const panNo = document.getElementById("signupPan").value;
    const username = document.getElementById("signupName").value;
    const password = document.getElementById("signupPassword").value;

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
    const panNo = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    const formData = new URLSearchParams();
    formData.append("username", panNo);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    });

    const data = await response.json();
    if (data.access_token) {
        document.getElementById("responseMessage").innerText = "Login successful! Token: " + data.access_token;
        localStorage.setItem("token", data.access_token);
    } else {
        document.getElementById("responseMessage").innerText = data.detail;
    }
}


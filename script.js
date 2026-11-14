// ==========================================
// SKILLNEXUS AI - INTELLIGENCE ENGINE
// Four collaborating specialized agents
// ==========================================

// Career skill database
const careerSkills = {
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"
    ],

    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React", "Git"
    ],

    "Data Analyst": [
        "Python", "SQL", "Excel", "Statistics", "Power BI"
    ],

    "Cybersecurity Analyst": [
        "Networking", "Linux", "Python", "Cybersecurity", "SIEM"
    ],

    "AI Engineer": [
        "Python", "Machine Learning", "Statistics",
        "SQL", "Deep Learning"
    ]
};

// Learning resource database
const learningResources = {
    "HTML": "Build a personal portfolio webpage.",
    "CSS": "Practice Flexbox, Grid and responsive design.",
    "JavaScript": "Build an interactive calculator.",
    "React": "Create a component-based task manager.",
    "Node.js": "Build a simple REST API.",
    "SQL": "Practice database queries and joins.",
    "Git": "Create a repository and practice Git commands.",
    "Python": "Build a Python mini project.",
    "Excel": "Practice spreadsheet analysis.",
    "Statistics": "Learn averages, probability and data interpretation.",
    "Power BI": "Create an interactive dashboard.",
    "Networking": "Study networking fundamentals.",
    "Linux": "Practice Linux commands.",
    "Cybersecurity": "Complete basic security exercises.",
    "SIEM": "Explore security event analysis.",
    "Machine Learning": "Build a simple prediction model.",
    "Deep Learning": "Explore neural network fundamentals."
};

// Application state
let currentReport = null;
let completedMissions = JSON.parse(
    localStorage.getItem("skillnexusMissions") || "[]"
);

// Normalize skills
function normalizeSkill(skill) {
    const aliases = {
        "js": "javascript",
        "html5": "html",
        "css3": "css",
        "reactjs": "react",
        "react.js": "react",
        "nodejs": "node.js",
        "node": "node.js",
        "py": "python"
    };

    const value = skill.trim().toLowerCase();
    return aliases[value] || value;
}

// ==========================================
// AGENT 1 - SKILL ANALYST
// ==========================================

function skillAnalyst(skills, requiredSkills) {

    const existing = skills.map(normalizeSkill);

    const matched = requiredSkills.filter(skill =>
        existing.includes(normalizeSkill(skill))
    );

    const missing = requiredSkills.filter(skill =>
        !existing.includes(normalizeSkill(skill))
    );

    document.getElementById("agent1").textContent =
        "✓ Skill analysis completed";

    return {
        matched,
        missing,
        existing
    };
}

// ==========================================
// AGENT 2 - CAREER MATCHER
// ==========================================

function careerMatcher(analysis) {

    const total = analysis.matched.length +
                  analysis.missing.length;

    const score = total === 0
        ? 0
        : Math.round(
            (analysis.matched.length / total) * 100
        );

    document.getElementById("agent2").textContent =
        "✓ Career matching completed";

    return score;
}

// ==========================================
// AGENT 3 - ROADMAP PLANNER
// ==========================================

function roadmapPlanner(missingSkills) {

    document.getElementById("agent3").textContent =
        "✓ Learning roadmap generated";

    return missingSkills.map((skill, index) => ({
        id: skill.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        skill: skill,
        mission: learningResources[skill] ||
            "Study the fundamentals and complete a practical exercise.",
        level: index < 2 ? "Beginner" : "Intermediate"
    }));
}

// ==========================================
// AGENT 4 - AI MENTOR
// ==========================================

function aiMentor(result, performance) {

    let feedback = "";
    let recommendation = "";

    if (performance === "excellent") {

        feedback =
            "Excellent work! You have demonstrated good understanding. Keep moving forward.";

        recommendation =
            "Continue to the next learning mission and try a more challenging project.";

    } else if (performance === "average") {

        feedback =
            "Good effort! You are improving. More practice will strengthen your understanding.";

        recommendation =
            "Repeat your current learning activity and complete another practice exercise.";

    } else {

        feedback =
            "Don't worry! Learning takes time. Let's strengthen your fundamentals.";

        recommendation =
            "Revisit the basics, study a simpler tutorial and try a beginner-level exercise.";
    }

    document.getElementById("agent4").textContent =
        "✓ Mentor evaluation completed";

    return {
        feedback,
        recommendation
    };
}

// ==========================================
// DISPLAY SKILLS
// ==========================================

function displaySkills(elementId, skills, emptyMessage) {

    const element = document.getElementById(elementId);

    if (skills.length === 0) {
        element.textContent = emptyMessage;
        return;
    }

    element.innerHTML = skills.map(skill =>
        `<div class="skill-item">✓ ${skill}</div>`
    ).join("");
}

// ==========================================
// DISPLAY ROADMAP
// ==========================================

function displayRoadmap(missions) {

    const container = document.getElementById("roadmapContent");

    if (missions.length === 0) {
        container.innerHTML =
            '<p class="empty">Congratulations! You have all the required skills.</p>';
        return;
    }

    container.innerHTML = missions.map((mission, index) => {

        const completed = completedMissions.includes(mission.id);

        return `
            <div class="mission">
                <h3>Mission ${index + 1}: ${mission.skill}</h3>

                <p>${mission.mission}</p>

                <p>Level: ${mission.level}</p>

                <label>
                    <input
                        type="checkbox"
                        class="mission-check"
                        data-id="${mission.id}"
                        ${completed ? "checked" : ""}
                        style="width:auto; margin-right:8px;"
                    >
                    ${completed ? "Completed" : "Mark as completed"}
                </label>
            </div>
        `;

    }).join("");

    document.querySelectorAll(".mission-check").forEach(check => {

        check.addEventListener("change", function() {

            const id = this.dataset.id;

            if (this.checked) {
                if (!completedMissions.includes(id)) {
                    completedMissions.push(id);
                }
            } else {
                completedMissions =
                    completedMissions.filter(item => item !== id);
            }

            localStorage.setItem(
                "skillnexusMissions",
                JSON.stringify(completedMissions)
            );

            this.parentElement.lastChild.textContent =
                this.checked ? "Completed" : "Mark as completed";

            updateMissionProgress();
        });

    });
}

// ==========================================
// MISSION PROGRESS
// ==========================================

function updateMissionProgress() {

    const total = currentReport
        ? currentReport.missions.length
        : 0;

    const completed = currentReport
        ? currentReport.missions.filter(m =>
            completedMissions.includes(m.id)
          ).length
        : 0;

    const old = document.getElementById("missionProgress");

    if (old) {
        old.remove();
    }

    const progress = document.createElement("p");

    progress.id = "missionProgress";
    progress.className = "section-subtitle";

    progress.textContent =
        `Mission progress: ${completed} / ${total} completed`;

    document.getElementById("roadmapContent")
        .prepend(progress);
}

// ==========================================
// MAIN CAREER ANALYSIS
// ==========================================

document.getElementById("analyzeBtn")
    .addEventListener("click", function() {

        const name = document.getElementById("studentName")
            .value.trim();

        const career = document.getElementById("career").value;

        const skillsInput = document.getElementById("skills")
            .value.trim();

        const projects = document.getElementById("projects")
            .value.trim();

        if (!name || !skillsInput) {
            alert("Please enter your name and existing skills.");
            return;
        }

        const skills = skillsInput
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);

        if (skills.length === 0) {
            alert("Please enter at least one skill.");
            return;
        }

        const requiredSkills = careerSkills[career];

        // Run Agent 1
        const analysis = skillAnalyst(
            skills,
            requiredSkills
        );

        // Run Agent 2
        const readiness = careerMatcher(analysis);

        // Run Agent 3
        const missions = roadmapPlanner(
            analysis.missing
        );

        // Store results
        currentReport = {
            name,
            career,
            projects,
            analysis,
            readiness,
            missions
        };

        // Display report
        document.getElementById("matchedCount")
            .textContent = analysis.matched.length;

        document.getElementById("missingCount")
            .textContent = analysis.missing.length;

        document.getElementById("readiness")
            .textContent = readiness + "%";

        displaySkills(
            "strengths",
            analysis.matched,
            "No matching skills found yet."
        );

        displaySkills(
            "gaps",
            analysis.missing,
            "You have all the required skills!"
        );

        displayRoadmap(missions);

        updateMissionProgress();

        document.getElementById("results").scrollIntoView({
            behavior: "smooth"
        });

        // Save learner information
        localStorage.setItem(
            "skillnexusProfile",
            JSON.stringify({
                name,
                career,
                skills,
                projects
            })
        );

        alert(
            "Hello " + name +
            "! Your career analysis is ready."
        );
    });

// ==========================================
// ADAPTIVE AI MENTOR ASSESSMENT
// ==========================================

document.getElementById("evaluateBtn")
    .addEventListener("click", function() {

        if (!currentReport) {
            alert("Please analyze your career profile first.");
            return;
        }

        const performance =
            document.getElementById("assessment").value;

        // Run Agent 4
        const result = aiMentor(
            currentReport,
            performance
        );

        const feedback =
            document.getElementById("mentorFeedback");

        feedback.innerHTML = `
            <div class="mission">
                <h3>✦ AI Mentor Feedback</h3>
                <p>${result.feedback}</p>
                <br>
                <h3>Recommended Next Action</h3>
                <p>${result.recommendation}</p>
            </div>
        `;

        // Adapt roadmap based on performance
        if (performance === "poor") {

            currentReport.missions.forEach(mission => {
                if (completedMissions.includes(mission.id)) {
                    completedMissions =
                        completedMissions.filter(
                            id => id !== mission.id
                        );
                }
            });

            localStorage.setItem(
                "skillnexusMissions",
                JSON.stringify(completedMissions)
            );

            displayRoadmap(currentReport.missions);

            updateMissionProgress();

        } else if (performance === "excellent") {

            const completed = currentReport.missions
                .filter(m => completedMissions.includes(m.id));

            const next = currentReport.missions
                .find(m => !completedMissions.includes(m.id));

            if (next) {
                feedback.innerHTML += `
                    <div class="mission">
                        <h3>Next Challenge</h3>
                        <p>Try completing: ${next.mission}</p>
                    </div>
                `;
            }
        }

        localStorage.setItem(
            "skillnexusAssessment",
            performance
        );

        feedback.scrollIntoView({
            behavior: "smooth"
        });
    });

// ==========================================
// LOAD SAVED PROFILE
// ==========================================

window.addEventListener("DOMContentLoaded", function() {

    const saved = localStorage.getItem("skillnexusProfile");

    if (saved) {

        const profile = JSON.parse(saved);

        document.getElementById("studentName").value =
            profile.name || "";

        document.getElementById("career").value =
            profile.career || "Full Stack Developer";

        document.getElementById("skills").value =
            profile.skills.join(", ");

        document.getElementById("projects").value =
            profile.projects || "";
    }

});

console.log("SkillNexus AI - Four Agent System Ready!");
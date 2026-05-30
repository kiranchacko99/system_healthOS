```javascript
const STORAGE_KEY = "the_system_v2";

const SIDE_QUESTS = [
    { text: "100 Lateral Raises", xp: 15 },
    { text: "15 Minute Mobility Session", xp: 10 },
    { text: "Drink 4 Litres Of Water", xp: 10 },
    { text: "5,000 Extra Steps", xp: 20 },
    { text: "10 Minute Stretch Session", xp: 10 },
    { text: "30 Minute Outdoor Walk", xp: 15 },
    { text: "Foam Roll For 10 Minutes", xp: 10 }
];

let state = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || createDefaultState();

function createDefaultState() {

    return {

        level: 1,
        xp: 0,

        momentum: 50,

        streak: 0,

        title: "The Awakening",

        lastReset: new Date().toDateString(),

        sideQuest: null,

        sideQuestCompleted: false,

        weights: [],

        achievements: [],

        stats: {
            strength: 10,
            muscle: 10,
            conditioning: 10,
            discipline: 10,
            recovery: 10
        },

        quests: {
            proteinQuest: false,
            calorieQuest: false,
            workoutQuest: false,
            stepsQuest: false,
            sleepQuest: false
        }

    };

}

function save() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}

function getXPNeeded() {

    return state.level * 1000;

}

function getMultiplier() {

    if (state.momentum >= 95) {
        return 1.5;
    }

    if (state.momentum >= 80) {
        return 1.2;
    }

    return 1.0;

}

function getTitle() {

    if (state.level >= 50)
        return "The Complete";

    if (state.level >= 40)
        return "The Unbroken";

    if (state.level >= 30)
        return "The Ascendant";

    if (state.level >= 20)
        return "The Relentless";

    if (state.level >= 10)
        return "The Consistent";

    return "The Awakening";

}

function addXP(amount) {

    const multiplier = getMultiplier();

    const finalXP =
        Math.floor(
            amount * multiplier
        );

    state.xp += finalXP;

    while (
        state.xp >= getXPNeeded()
    ) {

        state.xp -= getXPNeeded();

        state.level++;

        updateSystemMessage(
            `LEVEL UP! You are now Level ${state.level}`
        );

    }

    state.title = getTitle();

}

function updateSystemMessage(message) {

    document.getElementById(
        "systemMessage"
    ).textContent = message;

}

function generateSideQuest() {

    const randomIndex =
        Math.floor(
            Math.random() *
            SIDE_QUESTS.length
        );

    state.sideQuest =
        SIDE_QUESTS[randomIndex];

    state.sideQuestCompleted = false;

}

function dailyReset() {

    const today =
        new Date().toDateString();

    if (
        state.lastReset !== today
    ) {

        const completedCount =
            Object.values(
                state.quests
            ).filter(Boolean).length;

        if (completedCount >= 4) {

            state.streak++;

            state.momentum =
                Math.min(
                    100,
                    state.momentum + 5
                );

        } else {

            state.momentum =
                Math.max(
                    0,
                    state.momentum - 10
                );

        }

        state.quests = {

            proteinQuest: false,
            calorieQuest: false,
            workoutQuest: false,
            stepsQuest: false,
            sleepQuest: false

        };

        generateSideQuest();

        state.lastReset = today;

        save();

    }

}

function completeQuest(
    questId,
    xpReward,
    stat
) {

    if (
        state.quests[questId]
    ) {
        return;
    }

    state.quests[questId] = true;

    addXP(xpReward);

    state.stats[stat]++;

    updateSystemMessage(
        `Quest Completed: +${xpReward} XP`
    );

    save();

    updateUI();

}

function completeSideQuest() {

    if (
        state.sideQuestCompleted
    ) {
        return;
    }

    state.sideQuestCompleted = true;

    addXP(
        state.sideQuest.xp
    );

    updateSystemMessage(
        `Side Quest Complete: +${state.sideQuest.xp} XP`
    );

    save();

    updateUI();

}

function saveWeight() {

    const input =
        document.getElementById(
            "weightInput"
        );

    const value =
        Number(input.value);

    if (!value) return;

    state.weights.push({

        date:
            new Date()
            .toISOString(),

        weight: value

    });

    updateSystemMessage(
        `Weight Logged: ${value} lbs`
    );

    input.value = "";

    save();

    updateUI();

}

function updateUI() {

    document.getElementById(
        "level"
    ).textContent =
        state.level;

    document.getElementById(
        "playerTitle"
    ).textContent =
        state.title;

    document.getElementById(
        "xpText"
    ).textContent =
        `${state.xp} / ${getXPNeeded()} XP`;

    document.getElementById(
        "xpFill"
    ).style.width =
        `${(state.xp /
        getXPNeeded()) * 100}%`;

    document.getElementById(
        "momentumText"
    ).textContent =
        `${state.momentum} / 100`;

    document.getElementById(
        "momentumFill"
    ).style.width =
        `${state.momentum}%`;

    document.getElementById(
        "multiplierText"
    ).textContent =
        `XP Multiplier: ${getMultiplier()}x`;

    document.getElementById(
        "streakDisplay"
    ).textContent =
        `${state.streak} Days`;

    document.getElementById(
        "strengthStat"
    ).textContent =
        state.stats.strength;

    document.getElementById(
        "muscleStat"
    ).textContent =
        state.stats.muscle;

    document.getElementById(
        "conditioningStat"
    ).textContent =
        state.stats.conditioning;

    document.getElementById(
        "disciplineStat"
    ).textContent =
        state.stats.discipline;

    document.getElementById(
        "recoveryStat"
    ).textContent =
        state.stats.recovery;

    if (state.sideQuest) {

        document.getElementById(
            "sideQuestText"
        ).textContent =
            `${state.sideQuest.text} (+${state.sideQuest.xp} XP)`;

    }

    Object.keys(
        state.quests
    ).forEach(id => {

        const checkbox =
            document.getElementById(id);

        if (!checkbox)
            return;

        checkbox.checked =
            state.quests[id];

        checkbox.disabled =
            state.quests[id];

        if (
            checkbox.closest(".quest")
        ) {

            checkbox
            .closest(".quest")
            .classList.toggle(
                "completed",
                state.quests[id]
            );

        }

    });

    if (
        state.weights.length
    ) {

        const latest =
            state.weights[
                state.weights.length - 1
            ];

        document.getElementById(
            "currentWeight"
        ).textContent =
            `${latest.weight} lbs`;

        document.getElementById(
            "lastWeightEntry"
        ).textContent =
            `Last Entry: ${latest.weight} lbs`;

        const lost =
            215 - latest.weight;

        document.getElementById(
            "weightLost"
        ).textContent =
            `Lost: ${lost.toFixed(1)} lbs`;

    }

}

document
.getElementById(
    "proteinQuest"
)
.addEventListener(
    "change",
    () =>
        completeQuest(
            "proteinQuest",
            20,
            "muscle"
        )
);

document
.getElementById(
    "calorieQuest"
)
.addEventListener(
    "change",
    () =>
        completeQuest(
            "calorieQuest",
            25,
            "discipline"
        )
);

document
.getElementById(
    "workoutQuest"
)
.addEventListener(
    "change",
    () =>
        completeQuest(
            "workoutQuest",
            50,
            "strength"
        )
);

document
.getElementById(
    "stepsQuest"
)
.addEventListener(
    "change",
    () =>
        completeQuest(
            "stepsQuest",
            10,
            "conditioning"
        )
);

document
.getElementById(
    "sleepQuest"
)
.addEventListener(
    "change",
    () =>
        completeQuest(
            "sleepQuest",
            30,
            "recovery"
        )
);

document
.getElementById(
    "sideQuestButton"
)
.addEventListener(
    "click",
    completeSideQuest
);

document
.getElementById(
    "saveWeightButton"
)
.addEventListener(
    "click",
    saveWeight
);

dailyReset();

if (!state.sideQuest) {
    generateSideQuest();
}

updateUI();

save();
```

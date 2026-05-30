const STORAGE_KEY = "the_system";

let state = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || {
    xp: 0,
    level: 1,
    momentum: 50
};

function save(){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

function updateUI(){

    document.getElementById("level").textContent =
        state.level;

    document.getElementById("xp-text").textContent =
        `${state.xp} / ${state.level * 1000} XP`;

    document.getElementById("xp-fill").style.width =
        `${(state.xp/(state.level*1000))*100}%`;

    document.getElementById("momentum-text").textContent =
        `${state.momentum} / 100`;

    document.getElementById("momentum-fill").style.width =
        `${state.momentum}%`;
}

document
.querySelectorAll("input[type=checkbox]")
.forEach(box=>{

    box.addEventListener("change",()=>{

        const xp = Number(
            box.dataset.xp
        );

        if(box.checked){

            state.xp += xp;

            while(
                state.xp >= state.level*1000
            ){
                state.xp -= state.level*1000;
                state.level++;
            }

            save();
            updateUI();
        }
    });

});

updateUI();
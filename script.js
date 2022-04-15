{
    const guessRow = document.querySelector("#guess-row");
    const inputs = document.querySelectorAll("#color-input");
    const buttons = document.querySelectorAll(".palette .color");
    const submit = document.querySelector("#submit");
    const share = document.querySelector("#share");
    const help = document.querySelector("#help");

    const hex = ["#c91b35", "#1ac946", "#1a3ac9", "#e5e22d", "#ca26d3", "#1ab5c9"];

    let attempts = 0;
    let selectedColor = 1;
    let selectedButton = buttons[0];

    let date = new Date();
    let seed = "" + date.getUTCDate() + date.getMonth() + date.getUTCFullYear();
    let random = Math.seedrandom && window.location.search == "?daily" ? (new Math.seedrandom(seed)) : Math.random;
    let randomCombination = "";
    let colorCount = [];
    for (let i=0; i < 6; i++) {
        let code = Math.floor(random() * 6) + 1;

        randomCombination += code;
        colorCount[code] = (colorCount[code] ?? 0) + 1;
    }

    // console.log(randomCombination)

    for (let input of inputs) {
        input.onclick = () => {
            input.value = selectedColor;
            input.style.background = hex[selectedColor - 1];
        }
    }

    for (let button of buttons) {
        button.onclick = () => {
            selectedColor = button.value;

            if (selectedButton) {
                selectedButton.classList.remove("selected");
            }

            selectedButton = button;
            selectedButton.classList.add("selected");
        }
    }

    submit.onclick = () => {
        let guessedCombination = "";

        for (let input of inputs) {
            if (!input.value) break;

            guessedCombination += input.value;
        }

        if (guessedCombination.length == 6) {
            let count = [ ...colorCount ];

            let row = document.createElement("div");
            row.className = "row";

            for (let i=0; i < 6; i++) {
                if (randomCombination[i] == guessedCombination[i]) {
                    count[guessedCombination[i]]--;
                }
            }
            
            for (let i=0; i < 6; i++) {
                let code = guessedCombination[i];
                let color;

                let span = document.createElement("span");
                span.style.background = hex[code - 1];

                if (randomCombination[i] == code) {
                    color = "correct";
                } else if (count[code] > 0) {
                    color = "exists";
                    count[code]--;
                } else {
                    color = "wrong";
                }
                
                span.className = color;

                row.append(span);
            }

            guessRow.append(row);
            attempts++;

            if (guessedCombination == randomCombination || attempts == 6) {
                let text = "";
                let clipboard = new ClipboardJS("#share");
                clipboard.on("success", () => alert("Copied to the clipboard!"));

                document.querySelector("#controls").hidden = true;
                share.hidden = false;

                for (let guess of guessRow.children) {
                    for (let result of guess.children) {
                        let char;

                        switch (result.className) {
                            case "correct":
                                char = "🟩"
                                break;
                            case "exists":
                                char = "🟨";
                                break;
                            case "wrong":
                                char = "⬛";
                                break;
                        }

                        text += char;
                    }

                    text += "\n";
                }

                share.setAttribute("data-clipboard-text", `Yo! Check out my Colorle score! (${guessedCombination == randomCombination ? attempts : "X" }/6)\n\n${text}\n${window.location.host + window.location.path}`);
            }
        }
    }

    help.onclick = () => alert(`Your objective is to guess the the random color combination.

If the color outline is BLACK, it means the color doesn't exist in the combination.
If the color outline is ORANGE, it means the color exists but not at that position.
If the color outline is GREEN, it means the color is in the correct position.

Good luck!`);

    if (window.ClipboardJS == null || !Math.seedrandom && window.location.search == "?daily") {
        alert("Failed to load the resources. Please, restart the page.");
    }
}

console.warn("The fun is guessing! Close this window if you want to have fun :)");
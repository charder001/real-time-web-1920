var humanInput = document.querySelector("input")
var challengeString = document.querySelector("p").innerText

humanInput.addEventListener("input", function (changes) {
    if (changes.target.value && changes.target.value.length !== 0) {
        var currentHumanInput = changes.target.value;
        for (var index = 0; index < currentHumanInput.length; index++) {
            if (currentHumanInput[index] !==
                challengeString[index]) {
                humanInput.classList.remove("correct")
                humanInput.classList.add("incorrect")
                console.log("false")
            } else if (currentHumanInput[index] ===
                challengeString[index]) {
                humanInput.classList.remove("incorrect")
                humanInput.classList.add("correct")
                console.log("True")
            }
        }
    }
})
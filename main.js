let alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
let options = {
    pos1: {
        possibleLetters: [...alphabet],
        excludedLetters: [],
        foundLetter: ""
    },
    pos2: {
        possibleLetters: [...alphabet],
        excludedLetters: [],
        foundLetter: ""
    },
    pos3: {
        possibleLetters: [...alphabet],
        excludedLetters: [],
        foundLetter: ""
    },
    pos4: {
        possibleLetters: [...alphabet],
        excludedLetters: [],
        foundLetter: ""
    },
    pos5: {
        possibleLetters: [...alphabet],
        excludedLetters: [],
        foundLetter: ""
    },
    neededLetters: [],
    notNeededLetters: [],
    minimumLetterCount: Array(26).fill(0)
}

let guesses = []

function scoreWords(wordList, wordGuesses=wordList){
    let counts = {
        pos0: Array(26).fill(0),
        pos1: Array(26).fill(0),
        pos2: Array(26).fill(0),
        pos3: Array(26).fill(0),
        pos4: Array(26).fill(0),
        total: Array(26).fill(0)
    }

    wordList.forEach((word) => {
        word.split("").forEach((letter, index) => {
            counts[`pos${index}`][alphabet.indexOf(letter)]++
            counts.total[alphabet.indexOf(letter)]++
        })
    })
    
    let wordScores = wordGuesses.map((word) => {
        let total = 0
        let maxSpotsPerLetter = []
        word.split("").forEach((letter, index) => {
            const allCountsPerLetter = [
                word.charAt(0) == letter ? counts['pos0'][alphabet.indexOf(letter)] : -1,
                word.charAt(1) == letter ? counts['pos1'][alphabet.indexOf(letter)] : -1,
                word.charAt(2) == letter ? counts['pos2'][alphabet.indexOf(letter)] : -1,
                word.charAt(3) == letter ? counts['pos3'][alphabet.indexOf(letter)] : -1,
                word.charAt(4) == letter ? counts['pos4'][alphabet.indexOf(letter)] : -1,
            ]
            const maxSpot = allCountsPerLetter.indexOf(Math.max(...allCountsPerLetter))
            maxSpotsPerLetter.push(maxSpot)
        })
        // console.log(word, maxSpotsPerLetter)

        word.split("").forEach((letter, index) => {
            if(options[`pos${index+1}`].foundLetter == letter){
                return
            }
            if(options[`pos${index+1}`].possibleLetters.includes(letter) && !options.neededLetters.includes(letter)){
                total += Math.round(counts.total[alphabet.indexOf(letter)] / (word.match(new RegExp(letter, "g")) || []).length)
            }
            total += counts[`pos${index}`][alphabet.indexOf(letter)]
            if(wordList.includes(word)){
                total += 1
            }
        })

        

        return {total: total, word: word}
    }).filter((item) => {
        if(item.total == 0){
            return false
        }

        return true
    }).sort((a, b) => {
        if(a.total < b.total){
            return 1
        }else if(a.total > b.total){
            return -1
        }
        return 0
    })

    document.getElementById("best_next_guess").innerHTML = wordScores.map((item, index) => `<p>${index+1}. ${item.word}: <br>${item.total}</p>`).join("")
}

function filterWords(){
    let filteredWords = wordleList.filter((word) => {
        
        letterCounts = Array(26).fill(0)
        for(let i = 0; i < word.length; i++){
            letterCounts[alphabet.indexOf(word.charAt(i))]++
            if(options[`pos${i+1}`].excludedLetters.includes(word.charAt(i))){
                return false
            }
        }

        for(let i = 0; i < letterCounts.length; i++){
            if(letterCounts[i] < options.minimumLetterCount[i]){
                return false
            }
        }

        for(let i = 0; i < options.neededLetters.length; i++){
            if(word.indexOf(options.neededLetters[i]) == -1){
                return false
            }
        }

        



        return true
    })

    document.getElementById("possible_words").innerHTML = filteredWords.map((word) => `<p>${word}</p>`).join("")

    scoreWords(filteredWords, wordleList)
}


function applyGuesses(){
    document.getElementById("pre_guesses").innerHTML = guesses.map((guess) => {
        let word = guess.map((position) => {
            return `<p class="${position.color}_guess">${position.letter}</p>`
        }).join("")

        return `<div class="guess">${word}</div>`
    }).join("")

    options = {
        pos1: {
            possibleLetters: [...alphabet],
            excludedLetters: [],
            foundLetter: ""
        },
        pos2: {
            possibleLetters: [...alphabet],
            excludedLetters: [],
            foundLetter: ""
        },
        pos3: {
            possibleLetters: [...alphabet],
            excludedLetters: [],
            foundLetter: ""
        },
        pos4: {
            possibleLetters: [...alphabet],
            excludedLetters: [],
            foundLetter: ""
        },
        pos5: {
            possibleLetters: [...alphabet],
            excludedLetters: [],
            foundLetter: ""
        },
        neededLetters: [],
        notNeededLetters: [],
        minimumLetterCount: Array(26).fill(0)
    }

    guesses.forEach((guess) => {
        let invalidGuess = false
        guess.forEach((item) => {
            if(item.color == "grey"){
                let sameLetters = guess.filter((guess_item) => guess_item.letter == item.letter)
                let allGrey = sameLetters.filter((guess_item) => guess_item.color == 'grey')

                if(sameLetters.length == 1 || allGrey.length == sameLetters.length){
                    options[`pos1`].possibleLetters = options[`pos1`].possibleLetters.filter((letter) => letter != item.letter)
                    options[`pos2`].possibleLetters = options[`pos2`].possibleLetters.filter((letter) => letter != item.letter)
                    options[`pos3`].possibleLetters = options[`pos3`].possibleLetters.filter((letter) => letter != item.letter)
                    options[`pos4`].possibleLetters = options[`pos4`].possibleLetters.filter((letter) => letter != item.letter)
                    options[`pos5`].possibleLetters = options[`pos5`].possibleLetters.filter((letter) => letter != item.letter)

                    options[`pos1`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos1`].excludedLetters.push(item.letter) : null
                    options[`pos2`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos2`].excludedLetters.push(item.letter) : null
                    options[`pos3`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos3`].excludedLetters.push(item.letter) : null
                    options[`pos4`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos4`].excludedLetters.push(item.letter) : null
                    options[`pos5`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos5`].excludedLetters.push(item.letter) : null

                    options.notNeededLetters.indexOf(item.letter) == -1 ? options.notNeededLetters.push(item.letter) : null

                }else{
                    let anyYellowOfThatLetter = guess.filter((guess_item) => guess_item.letter == item.letter && guess_item.color == "yellow")

                    if(anyYellowOfThatLetter.length >= 1){
                        options[`pos${item.pos}`].possibleLetters = options[`pos${item.pos}`].possibleLetters.filter((letter) => letter != item.letter)
                        options[`pos${item.pos}`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos${item.pos}`].excludedLetters.push(item.letter) : null
                    
                    }else{
                        let notLetter = guess.filter((guess_item) => guess_item.letter != item.letter)

                        notLetter.forEach((guess_item) => {
                            options[`pos${guess_item.pos}`].possibleLetters = options[`pos${guess_item.pos}`].possibleLetters.filter((letter) => letter != item.letter)
                            options[`pos${guess_item.pos}`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos${guess_item.pos}`].excludedLetters.push(item.letter) : null
                        })
    
                        options[`pos${item.pos}`].possibleLetters = options[`pos${item.pos}`].possibleLetters.filter((letter) => letter != item.letter)
                        options[`pos${item.pos}`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos${item.pos}`].excludedLetters.push(item.letter) : null
                    }
                }


            }else if(item.color == "yellow"){
                let sameLetters = guess.filter((guess_item) => guess_item.letter == item.letter && guess_item.color != "grey")

                options[`pos${item.pos}`].possibleLetters = options[`pos${item.pos}`].possibleLetters.filter((letter) => letter != item.letter)
                options[`pos${item.pos}`].excludedLetters.indexOf(item.letter) == -1 ? options[`pos${item.pos}`].excludedLetters.push(item.letter) : null

                options.neededLetters.indexOf(item.letter) == -1 ? options.neededLetters.push(item.letter) : null

                if(sameLetters.length > options.minimumLetterCount[alphabet.indexOf(item.letter)]){
                    options.minimumLetterCount[alphabet.indexOf(item.letter)] = sameLetters.length
                }

            }else if(item.color == "green"){
                let sameLetters = guess.filter((guess_item) => guess_item.letter == item.letter && guess_item.color != "grey")

                if(options[`pos${item.pos}`].foundLetter != item.letter && options[`pos${item.pos}`].foundLetter != ""){
                    invalidGuess == true
                }

                options[`pos${item.pos}`].foundLetter = item.letter
                options[`pos${item.pos}`].excludedLetters = options[`pos${item.pos}`].excludedLetters.concat(options[`pos${item.pos}`].possibleLetters.filter((letter) => letter != item.letter))

                options.neededLetters.indexOf(item.letter) == -1 ? options.neededLetters.push(item.letter) : null

                if(sameLetters.length > options.minimumLetterCount[alphabet.indexOf(item.letter)]){
                    options.minimumLetterCount[alphabet.indexOf(item.letter)] = sameLetters.length
                }
            }
        })
    })

    console.log(options)
}

document.getElementById("enter_button").onclick = () => {
    let current_guess = []
    let missingCharacter = false

    document.querySelectorAll("input[type='text']").forEach((el) => {
        let letter = el.value
        let pos = el.id.charAt(el.id.length - 1)
        let color = document.querySelector(`input[type='radio'][name='${el.id}']:checked`).value

        if(letter == ""){
            missingCharacter = true
        }

        current_guess.push({letter: letter, pos: pos, color: color})
    })

    if(missingCharacter){
        return
    }

    if(guesses.length == 6){
        return
    }

    guesses.push(current_guess)
    applyGuesses()
    filterWords()
}

document.querySelectorAll("input[type='text']").forEach((el) => {
    el.onkeydown = (e) => {
        if(e.key != "Tab"){
            e.preventDefault()
        }
        if(alphabet.includes(e.key) && (el.value == "" || document.getSelection().toString() === el.value)){
            el.value = e.key

            document.getElementById(`item${parseInt(el.id.charAt(el.id.length - 1)) + 1}`)?.focus()
            document.getElementById(`item${parseInt(el.id.charAt(el.id.length - 1)) + 1}`)?.select()

            document.querySelector(`input[type='radio'][id='${el.id}_grey']`).checked = true

        }else if(e.key == 'Backspace'){
            if(el.value == "" && document.getElementById(`item${parseInt(el.id.charAt(el.id.length - 1)) - 1}`)){
                document.getElementById(`item${parseInt(el.id.charAt(el.id.length - 1)) - 1}`).focus()
                document.getElementById(`item${parseInt(el.id.charAt(el.id.length - 1)) - 1}`).value = ""
            }else{
                el.value = ""
            }
        }
    }
})

document.getElementById("undo_button").onclick = () => {
    guesses.pop()
    applyGuesses()
    filterWords()
}
document.getElementById("reset_button").onclick = () => {
    guesses = []

    document.querySelectorAll("input[type='text']").forEach((el) => {
        el.value = ""
        document.querySelector(`input[type='radio'][id='${el.id}_grey']`).checked = true
    })
    applyGuesses()
    filterWords()
}

filterWords()
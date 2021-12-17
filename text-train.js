// ui and translate kickoff, started by main.js 

function TextTrain(sentences) { 

    var trainSentenceIndex = 0
    var wordIndex = 0

    var clearInputOnInput = false

    var suggestionsE
    var langASentenceE
    var langBSentenceE
    var inputDoneE
    var inputE
    var placeholderE
    var restPlaceholderE
//    var langAHidden = true

    //    startButton.style.display = "none"
    var doorUI = document.getElementById("ht-door")
    doorUI.style.display = "none"

    var displayMode = 1 // 0: whole sentence printed, type in middle, 1: whole sentence as placeholder

    //    var container = document.createElement("div")
    var container = document.getElementById("tt-container")
    container.style.display = "inline"
//    container.innerHTML = html
    //    document.querySelectorAll(".WFnNle")[0].appendChild(container)
//    document.body.appendChild(container)

    inputE = document.getElementById("tt-input2")
    placeholderE = document.getElementById("tt-placeholder")
    restPlaceholderE = document.getElementById("tt-rest-placeholder")
    inputDoneE = document.getElementById("tt-input-done")
    langBSentenceE = document.getElementById("tt-lang-b")
    langASentenceE = document.getElementById("tt-lang-a-sentence")
    langAE = document.getElementById("tt-lang-a")
    suggestionsE = document.getElementById("tt-suggestions")
    helpE = document.getElementById("tt-help")
    var closeButton = document.getElementById("tt-close")

    // ui final touches
    inputE.focus()
    startTranslateWait()

    // TODO clearer error handling?
    kickOff()
/*    if(!kickOff()) {
//	alert("Paste text to the translate field, and click 'Start Text Train' again")
	return
    }  */


    restPlaceholderE.addEventListener("click", function() {
	inputE.focus()
    })

    inputE.addEventListener("input", function() {
	var s = inputE.value
	// different from placeholder? hide placeholder
	if (s != placeholderE.textContent.substring(0, s.length)) {
	    // remove the last character
	    inputE.value = s.substring(0, s.length-1)
//	    placeholderE.style.visibility = "hidden"
	} else {
	    // grey sentence
//	    placeholderE.style.visibility = "visible"
	}
	// if beyond first character in first word, grey langB sentence
/*	if (inputE.value.length > 0) {
	    langBSentenceE.style.color = "grey"
	} else if (wordIndex == 0) {
	    langBSentenceE.style.color = "black"
	} */

	// word break
	if (s.charAt(s.length-1) == " ") {
	    handleWordBreak()
	}
    })

    document.addEventListener("keydown", function(event) {
	if (event.code == "Escape") { // exit
	    close()
	}
    })

    inputE.addEventListener("keydown", function(event) {
	if (event.code == "Tab") {     // skip sentence
	    if(hasNextSentence()) {
		event.preventDefault()
		event.stopPropagation()
		nextSentence()
		inputE.focus()
	    } else {
		close()
	    }
	} else if (event.code == "Enter") { // word break
	    handleWordBreak()
	} /* else if (event.keyCode == 32) { // blank
	    if (langAHidden) {
		langBSentenceE.style.color = "grey"
		langAE.style.visibility = "visible"
		langAHidden = false
		inputE.focus()
	    }
	} */
    })

    helpE.addEventListener("click", function() {
	alert("Keyboard shortcuts: \n tab - skip sentence \n escape - quit")
    })

    // kickOff starts the data retrieving
    // returns false if no start, else true
    function kickOff() {
//	swd = new SentenceWordData()
//	swd.FillWithChapterString()

	// hacky, maybe on file loaded etc
	nextSentenceTranslated()
	
/*	if (swd.SentenceN > 0) {
	    //            swd.onSentenceTranslated = nextSentenceTranslated
            return true
	}
	return false */
    }

    // handleWordBreak takes care of words the user enters
    function handleWordBreak() {
	if(!sentences[trainSentenceIndex]) {
	    console.log("no sentence")
	    return
	}
	var wps = sentences[trainSentenceIndex].wordPairs
        // input does not match source
        var userIn = inputE.value.trim()
	//        var check = wordTranslitForUser(wps[wordIndex].Hebrew)
	var check = wps[wordIndex].Hebrew
        if (userIn !== check && clearNonLetters(userIn) != clearNonLetters(check)) {
//            console.log("input '"+userIn+"' does not match source '"+check+"'")
            return
        }

        // input matches, continue with...
        if (wordIndex < wps.length - 1) {     // ...next word
	    inputDoneE.innerHTML +=  check + " "
            wordIndex++
            inputE.value = ""
            updateSuggestions()
	    if (displayMode == 1) {
//		placeholderE.value = placeholderE.value.replace(/[^ ]+ /, "")
	    }
        }  else if (hasNextSentence()) {     // ...next sentence
            nextSentence()
            updateSuggestions()
        }
        else {      // ...done
            close()
        }
    }

    // hasNextSentence: is there a next sentence?
    function hasNextSentence() {
	return trainSentenceIndex < sentences.length - 1
    }

    // close closes the ui
    function close() {
	// remove container
	//	container.parentNode.removeChild(container)
	container.style.display = "none"
	// show start ui with start button
	doorUI.style.display = "inline"

	trainSentenceIndex = 0
	wordIndex = 0

/*	if(swd) {
	    swd.CloseMethod()
	    swd = null
	}*/

    }

    // display the next sentence
    function nextSentence() {
	
	inputE.value = ""
	wordIndex = 0
	trainSentenceIndex ++

	updateTrainSentence()
	updateSuggestions()
	// translation not yet available
/*	if (trainSentenceIndex > sentences.length - 1) {
//            console.log("translation not yet there")
            swd.onSentenceTranslated = nextSentenceTranslated()
            startTranslateWait()
	} else {
            updateTrainSentence()
	} */
    }

    // update the query sentence
    function updateTrainSentence() {
	var sentence = sentences[trainSentenceIndex]

	langBSentenceE.style.color = "black"
/*	langAE.style.visibility = "hidden"
	langAHidden = true */

//	stopTranslateWait()
	inputDoneE.innerText = ""
	// remember to hide langA and keep langB
	clearInputOnInput = true

	if (!sentence) {
            console.log("error no sentence")
            return
	}

	// get word boundaries for chinese.
	// todo maybe: for chinese, thai, etc stick words together, else translit sentence to keep punctuation?
	var langA = ""
	for (var w of sentence.wordPairs) {
	    //            langA += wordTranslitForUser(w.Hebrew) + " "
	    langA += w.Hebrew + " "
	}

	var langB = sentence.english
	// translit? or ist this too much?
//	langB += "<br/>hineh yhvh boqeq ha’arets ubolqah ve‘ivah faneha veheifits yoshebeha."
//	langB = translit(sentence.english) // maybe todo: same for langB as for langA?
	
	//	langBSentenceE.innerText = langB
	langBSentenceE.innerHTML = langB
	switch (displayMode) {
	case 0:
	    langASentenceE.innerText = langA
	case 1:
	    //	    placeholderE.value = langA
//	    placeholderE.value = sentence.wordPairs[wordIndex].Hebrew + " " 
	}
    }

    // remove trailing
    function clearNonLetters(s) {
	return s.replace(/\P{Letter}/ug, "")
    }

    function startTranslateWait() {
//	console.log("start translate wait")
	// show wait message
	//	inputE.placeholder = "translating words..."
	placeholderE.value = "translating words..."
    }
    function stopTranslateWait() {
	// hide wait message
	//	inputE.placeholder = ""
	placeholderE.value = ""
    }

    // if translation
    function nextSentenceTranslated() {
//	stopTranslateWait()

	updateTrainSentence()
	updateSuggestions()

	// remove listener
//	swd.onSentenceTranslated = null
    } 

    // in-place shuffle
    function shuffle(array) {
	array.sort((a, b) => Math.random() - 0.5)
    }



    // update the three suggestions
    // and maybe input placeholder
    // maybe rename: perWordUpdates
    function updateSuggestions() {

	if (!sentences[trainSentenceIndex]) { // not so cool, but at least avoid crash when current sentence is undefined?
	    return 
	}
	var wordPairs = sentences[trainSentenceIndex].wordPairs

	// langB
	var langB = wordPairs[wordIndex].English
//	langB = translit(langB)
	// langA
	var langA = wordPairs[wordIndex].Hebrew
//	langA = wordTranslitForUser(langA) 

	//	inputE.placeholder = langA + " " + langB
	switch (displayMode) {
	case 0:
	    placeholderE.value = langA + " " + langB
	    suggestionsE.style.display = "none"
	    break
	case 1:
	    // first word
	    //	    placeholderE.value = wordPairs[wordIndex].Hebrew + " "
	    placeholderE.textContent = wordPairs[wordIndex].Hebrew + " "
//	    placeholderE.style.visibility = "visible"
	    suggestionsE.textContent = langB

	    // next words
	    var rest = ""
	    for (var i = wordIndex + 1; i < wordPairs.length; i++) {
		rest += wordPairs[i].Hebrew + " "
	    }
	    restPlaceholderE.textContent = rest

	    
	}
    }

    // remove diacritics in string s
    function clearDiacritics(s) {
	s = s.normalize("NFD")
	return s.replace(/\p{Diacritic}/ug, "")
    }

    function ttInput(text) {
	console.log("input " + text)
    }
}

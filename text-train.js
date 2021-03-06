var hebLat = {
    "א": "a",
"ב": "b",
"ג": "g",
"ד": "d",
"ה": "h",
"ו": "o",
"ז": "c",
"ח": "H",
"ט": "T",
"י": "i",
"כ": "k",
"ל": "l",
"מ": "m",
"נ": "n",
"ס": "s",
"ע": "e",
"פ": "p",
"צ": "z",
"ק": "q",
"ר": "r",
"ש": "S",
    "ת": "t"
}

var latHeb = {
    "a": "א",
"b": "ב",
"g": "ג",
"d": "ד",
"h": "ה",
"o": "ו",
"c": "ז",
"H": "ח",
"T": "ט",
"i": "י",
"k": "כ",
"l": "ל",
"m": "מ",
"n": "נ",
"s": "ס",
"e": "ע",
"p": "פ",
"z": "צ",
"q": "ק",
"r": "ר",
"S": "ש",
    "t": "ת"
}

// hebToLat transliterates a hebrew string to latin letters
function hebToLat(s) {
    return tlit(s, hebLat)
}

// latToHeb translits s from latin to hebrew characters
function latToHeb(s) {
    return tlit(s, latHeb)
}

// tlit translits s using table. table is latHeb or hebLat
function tlit(s, table) {
    var out = ""
    for (var i = 0; i < s.length; i++) {
	var c = s.charAt(i)
	if (table[c]) {
	    out += table[c]
	} else {
	    out += c
	}
    }
    return out
}
    

// ui and translate kickoff, started by main.js 

function TextTrain(bible, sentences) { 

    var useHeb = false // type in hebrew or latin
    
    var trainSentenceIndex = 0
    var wordIndex = 0

//    var clearInputOnInput = false

    var suggestionsE
    var langASentenceE
    var langBSentenceE
    var inputDoneE
    var inputE
    var placeholderE

    //    startButton.style.display = "none"
    var doorUI = document.getElementById("ht-door")
    doorUI.style.display = "none"

    // ui
    var html = `<style> input:focus { outline: none }\
body {\
   font-family: arial\
}\
.inputcontainer {\
   display: block;\
   position: relative;\
   width:100%;\
   height: 36px;\
   left: -1px;\
   background-color: white;\
}\
#persistent-placeholder {\
   width:100%;\
   color: grey;\
   z-index: 0;\
   top: 0px; bottom: 0;\
   left: 0; right: 0;\
   background-color: transparent;\
   border: none;\
   font-size: 14pt;\
   line-height: 34px;\
}\
.free-typing {\
  z-index: 1;\
   width: 100%;\
   background-color: transparent;\
   position: absolute;\
   top: 0px;  bottom: 0;\
   left: 0;  right: 0;\
   border: none;\
   font-size: 14pt;\
   line-height: 36px; \
}\
</style>\
<div class="a88hkc" style="float:right; margin-top: 18pt" id="tt-help">help</div>\
<br/>\
<div id="texttrain" style="float:left; display: inline; width: 80%; margin-top: 24px; margin-left: 24pt; padding: 24pt; background: white;">\
<!-- <div style="font-size:8pt; color:gray; position relative; top:-60px" id="tt-help">help</div>-->\
<!-- <span id="tt-close" style="margin-left:auto; margin-right:0" class="material-icons-outlined" >close</span> --> \
<button id="tt-lat-heb" style="float:right"></button>
<div id="tt-lang-b">\
</div>\
<div id="tt-lang-a" style="">\
</div>\
<div style="display:flex"> <!-- flex wrap -->\
<span id="tt-input-done" style="vertical-align: top; line-height: 36px; display:inline-block; white-space:pre">\
</span>\
<div class="tt-move-with-input" style="display:inline-block; flex-grow:1"> \
<div class="inputcontainer">\
  <input id="tt-input2" type="text" value="" class="free-typing"></input>\
  <input autocomplete="off" value="" id="persistent-placeholder"/>\
</div> <!-- inputcontainer -->\
<!--<input id="tt-input" oninput="this.style.width=this.value.length+\'ch\'" style="border: 1px solid red; font-size:14pt" autofocus> -->\
</input>\
<div id="tt-suggestions" style="margin-left:1px; display:inline-block">\
</div>\
</div> <!-- move-with-input -->\
</div> <!-- flex wrap --> \
</div>`

    var displayMode = 1 // 0: whole sentence printed, type in middle, 1: whole sentence as placeholder

    var container = document.createElement("div")
    container.style = "font-size:14pt; position:relative;"
    container.innerHTML = html
    //    document.querySelectorAll(".WFnNle")[0].appendChild(container)
    document.body.appendChild(container)

    latHebSwitchE = document.getElementById("tt-lat-heb")
//    if (bible != "tnk") { latHebSwitchE.style.display == "none" }
    inputE = document.getElementById("tt-input2")
    placeholderE = document.getElementById("persistent-placeholder")
    inputDoneE = document.getElementById("tt-input-done")
    langBSentenceE = document.getElementById("tt-lang-b")
    langASentenceE = document.getElementById("tt-lang-a")
    suggestionsE = document.getElementById("tt-suggestions")
    helpE = document.getElementById("tt-help")
    var closeButton = document.getElementById("tt-close")

    // ui final touches
    inputE.focus()
//    startTranslateWait()

    // TODO clearer error handling?
    kickOff()
/*    if(!kickOff()) {
//	alert("Paste text to the translate field, and click 'Start Text Train' again")
	return
	}  */

    setLatHeb()
    
    latHebSwitchE.addEventListener("click", function() {
	useHeb = !useHeb
	setLatHeb()
	// don't clear inputDone on updateTrainSentence

	updateTrainSentence()
	
/*	var tmp = inputDoneE.innerHTML
	if (useHeb) {
	    inputDoneE.innerHTML = latToHeb(tmp)
	} else {
	    inputDoneE.innerHTML = hebToLat(tmp)
	} */
	updateSuggestions()
    })

    // setLatHeb updates ui alphabet-switch-button
    function setLatHeb() {
	if (!useHeb) {
	    if (bible == "tnk") {
		latHebSwitchE.innerText = "א"
	    } else if (bible == "apg") {
		latHebSwitchE.innerText = "α"
	    }
	} else {
	    latHebSwitchE.innerText = "A"
	}
    }

    inputE.addEventListener("input", function() {
	var s = inputE.value
	// different from placeholder? hide placeholder
	if (s != placeholderE.value.substring(0, s.length)) {
	    // remove the last character
//	    inputE.value = s.substring(0, s.length-1)
	    placeholderE.style.visibility = "hidden"
	} else {
	    placeholderE.style.visibility = "visible"
	}

	// word break
	if (s.charAt(s.length-1) == " ") { 
	    handleWordBreak()
	}
    })

    inputE.addEventListener("keydown", function(event) {
	if (event.code == "Tab") {     // skip sentence
	    if(hasNextSentence()) {
		nextSentence()
		inputE.focus()
	    } else {
		close()
	    }
	} else if (event.code == "Escape") { // exit
	    close()
	} else if (event.code == "Enter") { // word break
	    handleWordBreak()
	}
    })

    helpE.addEventListener("click", function() {
	alert("Retype the second sentence. \n Keyboard shortcuts: \n tab - skip sentence \n escape - quit \n")
    })

    // kickOff starts the data retrieving
    // returns false if no start, else true
    function kickOff() {
//	swd = new SentenceWordData()
//	swd.FillWithChapterString()

	// hacky, maybe on file loaded etc
	updateTrainSentence()
	updateSuggestions()

	
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
	// in case the user enters hebrew characters
	userIn = hebToLat(userIn)

	//        var check = wordTranslitForUser(wps[wordIndex].Hebrew)
	var check = wps[wordIndex].Hebrew
	if (bible == "apg" && useHeb == false) {
	    check = translit(check)
	}
	console.log(userIn + " " + check)

        if (userIn !== check && clearNonLetters(userIn) != clearNonLetters(check) && clearNonLetters(clearDiacritics(check)) != clearNonLetters(clearDiacritics(userIn))) {
	    // input not matching, return
            return
        }

        // input matches, continue with...
        if (wordIndex < wps.length - 1) {     // ...next word
	    if (useHeb) { check = latToHeb(check) }
            inputDoneE.innerHTML +=  check + " "
            wordIndex++
            inputE.value = ""
            updateSuggestions()
	    if (displayMode == 1) {
		placeholderE.value = placeholderE.value.replace(/[^ ]+ /, "")
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
	container.parentNode.removeChild(container)
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

	clearInput()
	updateTrainSentence()
	
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
	console.log("sentence: " + sentence.wordPairs[0])

//	stopTranslateWait()

	// remember to hide langA and keep langB
//	clearInputOnInput = true

	if (!sentence) {
            console.log("error no sentence")
            return
	}

	// get word boundaries for chinese.
	// todo maybe: for chinese, thai, etc stick words together, else translit sentence to keep punctuation?
	var langA = ""
	for (var w of sentence.wordPairs) {
	    //            langA += wordTranslitForUser(w.Hebrew) + " "
	    console.log("langA: " + w.Hebrew)
	    langA += w.Hebrew + " "
	}

	var langB = sentence.english
	// translit? or ist this too much?
//	langB += "<br/>hineh yhvh boqeq ha’arets ubolqah ve‘ivah faneha veheifits yoshebeha."
//	langB = translit(sentence.english) // maybe todo: same for langB as for langA?
	
	langBSentenceE.innerHTML = langB
	// display hebrew either in hebrew or latin letters
	if (!useHeb) {
	    langASentenceE.innerHTML = langA
	} else {
	    langASentenceE.innerHTML = latToHeb(langA)
	}
	if (bible == "apg" && useHeb == false) {
	    langASentenceE.innerHTML = translit(langA)
	}
	
/*	switch (displayMode) {
	case 0:
	    langASentenceE.innerText = langA
	case 1:
	    placeholderE.value = langA
	} */
    }

    // clearInput clears the entered input for next sentence
    function clearInput() {
	inputDoneE.innerText = ""
    }

    // use the whole word pool
    function generateSuggestions() {
	if (!sentences[trainSentenceIndex]) { // not so cool, but at least avoid crash when current sentence is undefined?
	    return ""
	}

	var string = ""
	// three next
	var wordPairs = sentences[trainSentenceIndex].wordPairs
	for(var n = 0; n < 3 && wordIndex + n < wordPairs.length; n++) { // three suggestions

	    // add langB
	    var langB = wordPairs[wordIndex+n].English
	    langB = langB.replace(/[\[\]0-9]+/g, "").trim()
	    string += langB + " "

	    // add langA
	    var langA = wordPairs[wordIndex+n].Hebrew
	    if (bible == "apg" && useHeb == false) {
		langA = translit(langA)
	    }
	    if (useHeb) {
		langA = latToHeb(langA)
	    }
	    string += langA + "<br/>"

	}
	return string

    } 

    // for single word s, remove blanks between syllables, e.g. chinese
/*    function wordTranslitForUser(s) {
	return translit(s).replace(/\s/g, "")
    } */

    // remove trailing
    function clearNonLetters(s) {
/*	if (bible == "apg") { // translit greek seems to have invisible letters
	    // a bit hacky, change?
	    return s.replace(/[^a-zA-Z]/, "")
	}*/
	return s.replace(/\P{Letter}/ug, "")
    }

    function startTranslateWait() {
//	console.log("start translate wait")
	// show wait message
	//	inputE.placeholder = "translating words..."
//	placeholderE.value = "translating words..."
    }
    
    function stopTranslateWait() {
	// hide wait message
	//	inputE.placeholder = ""
	placeholderE.value = ""
    }

    // if translation
/*    function nextSentenceTranslated() {
//	stopTranslateWait()

	updateTrainSentence()
	updateSuggestions()

	// remove listener
//	swd.onSentenceTranslated = null
    } */

    // in-place shuffle
    function shuffle(array) {
	array.sort((a, b) => Math.random() - 0.5)
    }



    // update the three suggestions
    // and maybe input placeholder
    function updateSuggestions() {
	//    suggestionsE.innerHTML = generateSuggestions(train[trainSentenceIndex].wordPairs, wordIndex)
	// inputE.placeholder = train[trainSentenceIndex].wordPairs[wordIndex][1]

	// below
	suggestionsE.innerHTML = generateSuggestions()

	/*
	// try out: placeholder

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
	    suggestionsE.textContent = langB
	} */
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
/*
// clearDiacriticKeepH removes diacritics, keeps the greek h
function clearDiacriticsKeepH() {
    oldTextContent =  oldTextContent.normalize("NFD")
    newTextContent = "";
    for(c of oldTextContent) {
	// replace every diacritic except greek h
	if (!c.match(/\p{Diacritic}/ug) || c.match(/\u0314/ug)) {
	    newTextContent += c;
	}
    }
}

// clearDiacritics removes all diacritics
function clearDiacritics() {
    oldTextContent =  oldTextContent.normalize("NFD")
    newTextContent = "";
    for(c of oldTextContent) {
	// replace every diacritic
	if (!c.match(/\p{Diacritic}/ug)) {
	    newTextContent += c;
	}
    }
}
*/

// file fetches
// var swd = SentenceWordData()

var filesJoiner = new FilesJoiner

var intFileThere = false
var engFileThere = false

 fetch('https://phrase-to-phrase.github.io/hebrew-train/english-douay-rheims-bible.txt')
    .then(response => response.text())
    .then(text => {
	filesJoiner.English = text
	engFileThere = true
	fileThere()
	console.log("douay-rheims fetched")
    })
fetch('https://phrase-to-phrase.github.io/hebrew-train/tnk-interlinear-tlit.txt')
    .then(response => response.text())
    .then(text => {
	filesJoiner.Interlinear = text
	intFileThere = true
	fileThere()
	}) 
/*fetch('https://phrase-to-phrase.github.io/hebrew-train/shalom.txt')
    .then(response => response.text())
    .then(text => {
	console.log("text: " + text)
    }) */

// fileThere starts the game if both int and eng files are there
function fileThere() {
    if (intFileThere && engFileThere) {
	var sentences = filesJoiner.GetSentences("jeremiah", 3)
//	new TextTrain(sentences)
    } 
}
    
/* function getBooks(data) {
    var a = data.split("\n")
    for (line of data) {
	var b = line.split("\t")
	var c = b[0].split(" ")
	var book = c[0]
	var d = c[ */
var bookSelect = document.getElementById("select-book")
var chapterSelect = document.getElementById("select-chapter")

setChapters()

bookSelect.addEventListener("change", function() {
    console.log("book select")

    setChapters()
})

// setChapters sets the chapters for the selected book
function setChapters() {
    var a = bookSelect.value.split("|")
    var book = a[0]
    var chapter = a[1]

    chapterSelect.innerHTML = ""
    for(var i = 1; i <= chapter; i++) {
	var opt = document.createElement("option")
	opt.value = i
	opt.innerHTML = i

	chapterSelect.appendChild(opt)
    }
}


var startButton = document.getElementById("button-start")
startButton.addEventListener("click", function() {
    //    var swd = filesJoiner.GetSWD(book, chapter)
    // var sentences = filesJoiner.GetSentences("isaiah", 24)
    //    var sentences = filesJoiner.GetSentences("psalms", 1)

    var a = bookSelect.value.split("|")
    var book = a[0]
    var chapter = (chapterSelect.value ? chapterSelect.value : 1)
    var sentences = filesJoiner.GetSentences(book, chapter)
//    var sentences = filesJoiner.GetSentences(bookSelect.options[bookSelect.selectedIndex].text, 1)
    console.log("sentences length:" + sentences.length)
    new TextTrain(sentences)
})


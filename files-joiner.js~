function WordPair(english, hebrew) {
    this.English = english
    this.Hebrew = hebrew
}

function FilesJoiner() {
    this.English
    this.Interlinear
    this.GetSentences = getSentences

    var self = this

    // maybe: GetSWDFrom: start at eighty three per cent of book, etc
    function GetSWDFrom(fraction) {
    }

    // GetSentences returns the training data for one chapter
    function getSentences(book, chapter) {
	var sentences = []

	// filter lines
	
	var englishAll = self.English.split("\n")
	var intAll = self.Interlinear.split("\n")

	var bookChapterR = new RegExp("^" + book + " " + chapter + ":")
//	var bookChapterR = new RegExp("isaiah 24:")
	var englishLines = englishAll.filter(line =>  line.match(bookChapterR) )
	var intLines = intAll.filter(line => line.match(bookChapterR) )
//	englishLines = englishAll[0..10]
//	intLines = intAll[0..10]
//	console.log(intLines.length)

	// parse array
	for (var i = 0; i < intLines.length; i++) {
	    var english = englishLines[i].split("\t")[1]
	    var interlin = intLines[i].split("\t")[1]
	    var verse = {
		english: english,
		wordPairs: []
	    }
	    // extract wordpairs
	    var a = interlin.split("$")
	    for (var p of a) {
		var b = p.split("#")
		if (b.length < 3) { continue }
		var english = b[0]
		var hebrew = b[2]
		hebrew = hebrew.replaceAll(/[^a-zA-Z]/g, " ")
		hebrew = hebrew.replaceAll(/  +/g, " ")
		verse.wordPairs.push(new WordPair(english.trim(), hebrew.trim()))
	    }
	    sentences.push(verse)
	}

	return sentences
    }
}

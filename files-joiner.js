function WordPair(english, hebrew) {
    this.English = english
    this.Hebrew = hebrew
}

function FilesJoiner() {
    this.English
    this.TNKInterlinear
    this.APGInterlinear
    this.GetSentences = getSentences

    var self = this

    // maybe: GetSWDFrom: start at eighty three per cent of book, etc
    function GetSWDFrom(fraction) {
    }

    // GetSentences returns the training data for one chapter
    function getSentences(bible, book, chapter) {
	var sentences = []

	// filter lines
	
	var englishAll = self.English.split("\n")
	var intAll
	if (bible == "tnk") {
	    intAll = self.TNKInterlinear.split("\n")
	} else if (bible == "apg") {
	    intAll = self.APGInterlinear.split("\n")
	}

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
	    console.log("a:" + a)
	    for (var p of a) {
		var b = p.split("#")

		var lang_a
		var lang_b = ""
		console.log("bible: " + bible)
		if (bible == "tnk") {
		    if (b.length < 3) { continue }
		    lang_b = b[0]
		    lang_a = b[2]
		    lang_a = lang_a.replaceAll(/[^a-zA-Z]/g, " ")
		    lang_a = lang_a.replaceAll(/  +/g, " ")
		} else if (bible == "apg") {
		    lang_b = b[0]
		    lang_a = b[1]
		}
		if (!lang_a) { continue } // lang_b may stay empty		
		verse.wordPairs.push(new WordPair(lang_b.trim(), lang_a.trim()))
	    }
	    sentences.push(verse)
	}

	return sentences
    }
}

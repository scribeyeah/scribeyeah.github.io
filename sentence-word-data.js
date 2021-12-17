function WordPair(english, hebrew) {
    this.English = english
    this.Hebrew = hebrew
}

function SentenceWordData() {
    var data;

    this.FillWithChapterString = fillWithChapterString
    
    this.Sentences = []
    this.SentenceN = 0

    this.Verses = []

    var self = this
    
    init()

    function init() {
	var english =  "BEHOLD the Lord shall lay waste the earth, and shall strip it, and shall afflict the face thereof, and scatter abroad the inhabitants thereof."
	var wordPairs = "behold # hnh, $ yahweh # ihoh $ makes empty # boqq $ the earth # harz $ and makes it waste # obolqh "  // $ and distorts # oeoh $  its surface #   ､  pnih $ and scatters abroad # ohpiz $  its inhabitants #   .  iSbih׃ $"
	var a = wordPairs.split("$")
	var verse = {
	    english: english,
	    wordPairs: []
	}
	for (var p of a) {
	    console.log(p)
	    var b = p.split("#")
	    var english = b[0]
	    var hebrew = b[1]
	    hebrew = hebrew.replace(/[^a-zA-Z]/, " ")
	    hebrew = hebrew.replace(/  +/, " ")
	    verse.wordPairs.push(new WordPair(english.trim(), hebrew.trim()))
	}
	self.Sentences.push(verse)
	self.SentenceN = 1
    }

    fetchTest()
    // fetchTest: ajax test
    function fetchTest() {
	console.log("hello fetch test")
	fetch('https://phrase-to-phrase.github.io/hebrew-train/english-douay-rheims-bible.txt')
	    .then(data => {
		console.log("douay-rheims fetched")
	    })

    }

    function fillWithChapterString(s) {
	
/*	var lines = s.split("\n")
	console.log(s)
	for (line in lines) {
	    console.log(line)
	} */
    }
}

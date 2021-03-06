/*var fs = require('fs');
var readline = require('readline');

// see https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
eval(fs.readFileSync('/home/max/bash-translit/unicode-tlit-array.js')+'');
eval(fs.readFileSync('/home/max/bash-translit/kanjidict.js')+'');

// see https://stackoverflow.com/questions/20086849/how-to-read-from-stdin-line-by-line-in-node
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    //    console.log(line);
    console.log(translit(line));
}) */

var unicodeDict = new Map()
for (var entry of unicodeDictArray) {
    // if values appear more than once, take the last, it's probably from the edit file
    unicodeDict.set(entry[0], entry[1])
}

var kanjiDict = new Map()
for (var entry of kanjiDictArray) {
    // if values appear more than once, take the last, it's probably from the edit file
    kanjiDict.set(entry[0], entry[1])
}


function translit(oldTextContent) {
    // insert blanks in chinese or thai
    var nblanks = (oldTextContent.match(/ /g) || []).length
    var insertBlanks = false
    
    //    oldTextContent = oldTextContent.normalize("NFD")
    oldTextContent = oldTextContent.normalize("NFD") // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    var newTextContent = ""
    for (var i = 0; i < oldTextContent.length; i++) {
	var c = oldTextContent.charAt(i)
//    for (var c of oldTextContent) {

	// on google page and latin? skip. latin replacements screw up the page, whyever
/*	if(tab_url.match(/[^\/]*google/) && c.match(/\p{Script=Latin}/u)) {
	    newTextContent += c
	    continue
	}*/
	
	// chinese? insert blanks.
	if (/[\u3400-\u9FBF]/.test(c)) {
	    newTextContent += " "
	}
	// number and last character chinese? insert blank
	if (c.match(/\p{N}/u) && i > 0 && oldTextContent.charAt(i-1).match(/[\u3400-\u9FBF]/)) {
	    newTextContent += " "
	}
	// japanese, hiragana, katakana, kanji? insert blanks.
	if (c.match(/\p{Script=Hiragana}/u) || c.match(/\p{Script=Katakana}/u) || c.match(/[\u4e00-\u9fbf]/)) {
	    newTextContent += " "
	}

	// insert greek h accent before last: from ohs to hos, uhpo to hupo
	if (c.match(/\u0314/)) {
	    var l = newTextContent.length
	    // see https://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string/4364902
	    newTextContent = newTextContent.substring(0, l-1) + unicodeDict.get(c) + newTextContent.substring(l-1)
	    continue;
	}
	
	newC = c;
	if(unicodeDict.has(c)) {
	    newC = unicodeDict.get(c)
	}
	// japanese kanji? (the chinese glyphs in japanese language)
	if ( /[\u4e00-\u9fbf]/.test(c) && kanjiDict.has(c) && isJapanese(oldTextContent)) {
	    newC = kanjiDict.get(c)
	}
	newTextContent += newC
	
    }
    return newTextContent
}

function isJapanese(text) {
    return text.match(/\p{Script=Hiragana}/ug) || text.match(/\p{Script=Katakana}/ug)
}


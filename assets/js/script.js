/* eslint-env browser, es6 */

let finalTweet;

window.getQuote = function getQuote() { // create onclick function
	const quoteScript = document.createElement(`script`); // create script element

	// set script attributes
	quoteScript.requestId = Math.floor(Math.random() * 999999).toString(); // 'cache-buster'
	quoteScript.type = `text/javascript`;
	quoteScript.id = `quoteScript`;
	quoteScript.src = `https://quotesondesign.com/wp-json/posts?requestId=${quoteScript.requestId}&filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=setQuote`;

	document.getElementsByTagName(`head`)[0].appendChild(quoteScript); // append script element to head of document

	// callback function (setQuote) envoked when finished //
};

window.onload = window.getQuote;

window.setQuote = function setQuote(data) { // function to handle JSONP payload
	const head = document.getElementsByTagName(`head`);
	const title = document.getElementsByTagName(`title`);
	const quote = document.getElementsByClassName(`quote`);
	const author = document.getElementsByClassName(`author`);
	const source = document.getElementsByClassName(`source`);
	let sourceLink;

	head[0].removeChild(quoteScript); // remove script element

	title[0].innerHTML = `Random Quote Machine - #${data[0].ID}`; // set title of page
	quote[0].innerHTML = `${data[0].content}`; // set quote content
	author[0].innerHTML = `- ${data[0].title}`; // set author content

	if (data[0].custom_meta) {
		source[0].innerHTML = `	${data[0].custom_meta.Source}`; // set source content

		sourceLink = source[0].getElementsByTagName(`a`);
		sourceLink[0].target = `_blank`;
		sourceLink[0].rel = `noopener noreferrer`;
	}

	window.formatTweet(data);
};

window.formatTweet = function formatTweet(encodedTweet) {
	const rawTweet = `${encodedTweet[0].content}`;
	let tweetAuthor = `- ${encodedTweet[0].title}`;

	finalTweet = `${rawTweet}`;

	Encoder.hasEncoded(finalTweet)
	&& (finalTweet = Encoder.htmlDecode(finalTweet));

	Encoder.hasEncoded(tweetAuthor)
	&& (tweetAuthor = Encoder.htmlDecode(tweetAuthor));

	const openParTagSingle = new RegExp(/<p[^>]*>/, ``); // first open p element
	const openParTagGlobal = new RegExp(/<p[^>]*>/, `g`); // remaining open p elements
	const endOfLine1 = new RegExp(/([^\w\s])\s*<\/p>\n$/, ``); // end of line
	const endOfLine2 = new RegExp(/([^\W\s])\s*<\/p>\n$/, ``); // end of line
	const anyElemGlobal = new RegExp(/<\/?[^>]+(>|$)/, `g`); // any remaining elements

	const tweetLimit = 140;

	finalTweet.length > (tweetLimit + 5)
	? finalTweet = `"${finalTweet
			.replace(openParTagSingle, ``)
			.replace(openParTagGlobal, `\n`)
			.replace(endOfLine1, ``)
			.replace(anyElemGlobal, ``)
			.slice(0, tweetLimit - (tweetAuthor.length + 7))}..."\n\n${tweetAuthor}`
	: finalTweet = `"${finalTweet
			.replace(openParTagSingle, ``)
			.replace(openParTagGlobal, `\n`)
			.replace(endOfLine1, `$1"\n\n`)
			.replace(endOfLine2, `$1."\n\n`)
			.replace(anyElemGlobal, ``)}${tweetAuthor}`;
};

window.tweetQuote = function tweetQuote(finalTweet) {
	const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(finalTweet)}`;

	window.open(tweetUrl);
};

window.openModal = function openModal() {
	const modal = document.getElementsByClassName(`modal`);

	modal[0].style.display = `block`;
};

window.closeModal = function closeModal() {
	const modal = document.getElementsByClassName(`modal`);
	const modalContent = document.getElementsByClassName(`modal-content`);

	modal[0].style.display = `none`;

	window.onclick = function onclick(event) {
		event.target === modalContent
		&& (modal[0].style.display = `none`);
	};
};

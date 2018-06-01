(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var Pickathing = function Pickathing(elementId, hasSearch, options) {
	this.transTimeout;
	this.transTimeoutDelay = 201;
	// Sets default placeholder if not specified with option
	this.searchFieldText = 'Search';
	this.ignoreDiacritics = false;

	if (options) {
		this.filterAnotherBy = options.filterAttr;
		this.filterAnother = options.filter;
		this.transTimeoutDelay = options.focusDelay + 1;
		this.searchFieldText = options.searchLabel; // Sets search field text to passed in value
		this.ignoreDiacritics = options.ignoreDiacritics;
	}
	// Sets element param to store element that was passed in
	this.element = document.getElementById(elementId);
	// Gets parent element of passed element
	this.parentEl = this.element.parentNode;
	// Checks if hasSearch got true or false
	this.hasSearch = typeof hasSearch === 'undefined' ? true : hasSearch;
	this.required = this.element.hasAttribute('data-required');
	// Creates element and
	this.wrapper = document.createElement('div');
	this.wrapper.className = 'Pickathing';
	this.wrapper = this.parentEl.insertBefore(this.wrapper, this.element);

	if (this.required) {
		this.wrapper.setAttribute('data-required', '');
		this.element.removeAttribute('data-required');
	}

	// Array that stores selected options when multiple
	this.optionElements = [];
	// Stores all options from select
	this.options = this.element.options;
	this.selectedOption;

	this.multiple = this.element.multiple;

	if (this.multiple) {
		this.wrapper.classList.add('Pickathing--multiple');
		this.value = {};
	} else {
		this.value = this.element.value;
	}

	this.searchField;

	this.focusedOption = -1;
	if (!this.hasSearch) {
		this.focusedOption = 0;
	}
	this.focusableOptions = [];

	this.characters = {
		'Á': 'A',
		'Ă': 'A',
		'Ắ': 'A',
		'Ặ': 'A',
		'Ằ': 'A',
		'Ẳ': 'A',
		'Ẵ': 'A',
		'Ǎ': 'A',
		'Â': 'A',
		'Ấ': 'A',
		'Ậ': 'A',
		'Ầ': 'A',
		'Ẩ': 'A',
		'Ẫ': 'A',
		'Ä': 'A',
		'Ǟ': 'A',
		'Ȧ': 'A',
		'Ǡ': 'A',
		'Ạ': 'A',
		'Ȁ': 'A',
		'À': 'A',
		'Ả': 'A',
		'Ȃ': 'A',
		'Ā': 'A',
		'Ą': 'A',
		'Å': 'A',
		'Ǻ': 'A',
		'Ḁ': 'A',
		'Ⱥ': 'A',
		'Ã': 'A',
		'Ꜳ': 'AA',
		'Æ': 'AE',
		'Ǽ': 'AE',
		'Ǣ': 'AE',
		'Ꜵ': 'AO',
		'Ꜷ': 'AU',
		'Ꜹ': 'AV',
		'Ꜻ': 'AV',
		'Ꜽ': 'AY',
		'Ḃ': 'B',
		'Ḅ': 'B',
		'Ɓ': 'B',
		'Ḇ': 'B',
		'Ƀ': 'B',
		'Ƃ': 'B',
		'Ć': 'C',
		'Č': 'C',
		'Ç': 'C',
		'Ḉ': 'C',
		'Ĉ': 'C',
		'Ċ': 'C',
		'Ƈ': 'C',
		'Ȼ': 'C',
		'Ď': 'D',
		'Ḑ': 'D',
		'Ḓ': 'D',
		'Ḋ': 'D',
		'Ḍ': 'D',
		'Ɗ': 'D',
		'Ḏ': 'D',
		'ǲ': 'D',
		'ǅ': 'D',
		'Đ': 'D',
		'Ƌ': 'D',
		'Ǳ': 'DZ',
		'Ǆ': 'DZ',
		'É': 'E',
		'Ĕ': 'E',
		'Ě': 'E',
		'Ȩ': 'E',
		'Ḝ': 'E',
		'Ê': 'E',
		'Ế': 'E',
		'Ệ': 'E',
		'Ề': 'E',
		'Ể': 'E',
		'Ễ': 'E',
		'Ḙ': 'E',
		'Ë': 'E',
		'Ė': 'E',
		'Ẹ': 'E',
		'Ȅ': 'E',
		'È': 'E',
		'Ẻ': 'E',
		'Ȇ': 'E',
		'Ē': 'E',
		'Ḗ': 'E',
		'Ḕ': 'E',
		'Ę': 'E',
		'Ɇ': 'E',
		'Ẽ': 'E',
		'Ḛ': 'E',
		'Ꝫ': 'ET',
		'Ḟ': 'F',
		'Ƒ': 'F',
		'Ǵ': 'G',
		'Ğ': 'G',
		'Ǧ': 'G',
		'Ģ': 'G',
		'Ĝ': 'G',
		'Ġ': 'G',
		'Ɠ': 'G',
		'Ḡ': 'G',
		'Ǥ': 'G',
		'Ḫ': 'H',
		'Ȟ': 'H',
		'Ḩ': 'H',
		'Ĥ': 'H',
		'Ⱨ': 'H',
		'Ḧ': 'H',
		'Ḣ': 'H',
		'Ḥ': 'H',
		'Ħ': 'H',
		'Í': 'I',
		'Ĭ': 'I',
		'Ǐ': 'I',
		'Î': 'I',
		'Ï': 'I',
		'Ḯ': 'I',
		'İ': 'I',
		'Ị': 'I',
		'Ȉ': 'I',
		'Ì': 'I',
		'Ỉ': 'I',
		'Ȋ': 'I',
		'Ī': 'I',
		'Į': 'I',
		'Ɨ': 'I',
		'Ĩ': 'I',
		'Ḭ': 'I',
		'Ꝺ': 'D',
		'Ꝼ': 'F',
		'Ᵹ': 'G',
		'Ꞃ': 'R',
		'Ꞅ': 'S',
		'Ꞇ': 'T',
		'Ꝭ': 'IS',
		'Ĵ': 'J',
		'Ɉ': 'J',
		'Ḱ': 'K',
		'Ǩ': 'K',
		'Ķ': 'K',
		'Ⱪ': 'K',
		'Ꝃ': 'K',
		'Ḳ': 'K',
		'Ƙ': 'K',
		'Ḵ': 'K',
		'Ꝁ': 'K',
		'Ꝅ': 'K',
		'Ĺ': 'L',
		'Ƚ': 'L',
		'Ľ': 'L',
		'Ļ': 'L',
		'Ḽ': 'L',
		'Ḷ': 'L',
		'Ḹ': 'L',
		'Ⱡ': 'L',
		'Ꝉ': 'L',
		'Ḻ': 'L',
		'Ŀ': 'L',
		'Ɫ': 'L',
		'ǈ': 'L',
		'Ł': 'L',
		'Ǉ': 'LJ',
		'Ḿ': 'M',
		'Ṁ': 'M',
		'Ṃ': 'M',
		'Ɱ': 'M',
		'Ń': 'N',
		'Ň': 'N',
		'Ņ': 'N',
		'Ṋ': 'N',
		'Ṅ': 'N',
		'Ṇ': 'N',
		'Ǹ': 'N',
		'Ɲ': 'N',
		'Ṉ': 'N',
		'Ƞ': 'N',
		'ǋ': 'N',
		'Ñ': 'N',
		'Ǌ': 'NJ',
		'Ó': 'O',
		'Ŏ': 'O',
		'Ǒ': 'O',
		'Ô': 'O',
		'Ố': 'O',
		'Ộ': 'O',
		'Ồ': 'O',
		'Ổ': 'O',
		'Ỗ': 'O',
		'Ö': 'O',
		'Ȫ': 'O',
		'Ȯ': 'O',
		'Ȱ': 'O',
		'Ọ': 'O',
		'Ő': 'O',
		'Ȍ': 'O',
		'Ò': 'O',
		'Ỏ': 'O',
		'Ơ': 'O',
		'Ớ': 'O',
		'Ợ': 'O',
		'Ờ': 'O',
		'Ở': 'O',
		'Ỡ': 'O',
		'Ȏ': 'O',
		'Ꝋ': 'O',
		'Ꝍ': 'O',
		'Ō': 'O',
		'Ṓ': 'O',
		'Ṑ': 'O',
		'Ɵ': 'O',
		'Ǫ': 'O',
		'Ǭ': 'O',
		'Ø': 'O',
		'Ǿ': 'O',
		'Õ': 'O',
		'Ṍ': 'O',
		'Ṏ': 'O',
		'Ȭ': 'O',
		'Ƣ': 'OI',
		'Ꝏ': 'OO',
		'Ɛ': 'E',
		'Ɔ': 'O',
		'Ȣ': 'OU',
		'Ṕ': 'P',
		'Ṗ': 'P',
		'Ꝓ': 'P',
		'Ƥ': 'P',
		'Ꝕ': 'P',
		'Ᵽ': 'P',
		'Ꝑ': 'P',
		'Ꝙ': 'Q',
		'Ꝗ': 'Q',
		'Ŕ': 'R',
		'Ř': 'R',
		'Ŗ': 'R',
		'Ṙ': 'R',
		'Ṛ': 'R',
		'Ṝ': 'R',
		'Ȑ': 'R',
		'Ȓ': 'R',
		'Ṟ': 'R',
		'Ɍ': 'R',
		'Ɽ': 'R',
		'Ꜿ': 'C',
		'Ǝ': 'E',
		'Ś': 'S',
		'Ṥ': 'S',
		'Š': 'S',
		'Ṧ': 'S',
		'Ş': 'S',
		'Ŝ': 'S',
		'Ș': 'S',
		'Ṡ': 'S',
		'Ṣ': 'S',
		'Ṩ': 'S',
		'ß': 'ss',
		'Ť': 'T',
		'Ţ': 'T',
		'Ṱ': 'T',
		'Ț': 'T',
		'Ⱦ': 'T',
		'Ṫ': 'T',
		'Ṭ': 'T',
		'Ƭ': 'T',
		'Ṯ': 'T',
		'Ʈ': 'T',
		'Ŧ': 'T',
		'Ɐ': 'A',
		'Ꞁ': 'L',
		'Ɯ': 'M',
		'Ʌ': 'V',
		'Ꜩ': 'TZ',
		'Ú': 'U',
		'Ŭ': 'U',
		'Ǔ': 'U',
		'Û': 'U',
		'Ṷ': 'U',
		'Ü': 'U',
		'Ǘ': 'U',
		'Ǚ': 'U',
		'Ǜ': 'U',
		'Ǖ': 'U',
		'Ṳ': 'U',
		'Ụ': 'U',
		'Ű': 'U',
		'Ȕ': 'U',
		'Ù': 'U',
		'Ủ': 'U',
		'Ư': 'U',
		'Ứ': 'U',
		'Ự': 'U',
		'Ừ': 'U',
		'Ử': 'U',
		'Ữ': 'U',
		'Ȗ': 'U',
		'Ū': 'U',
		'Ṻ': 'U',
		'Ų': 'U',
		'Ů': 'U',
		'Ũ': 'U',
		'Ṹ': 'U',
		'Ṵ': 'U',
		'Ꝟ': 'V',
		'Ṿ': 'V',
		'Ʋ': 'V',
		'Ṽ': 'V',
		'Ꝡ': 'VY',
		'Ẃ': 'W',
		'Ŵ': 'W',
		'Ẅ': 'W',
		'Ẇ': 'W',
		'Ẉ': 'W',
		'Ẁ': 'W',
		'Ⱳ': 'W',
		'Ẍ': 'X',
		'Ẋ': 'X',
		'Ý': 'Y',
		'Ŷ': 'Y',
		'Ÿ': 'Y',
		'Ẏ': 'Y',
		'Ỵ': 'Y',
		'Ỳ': 'Y',
		'Ƴ': 'Y',
		'Ỷ': 'Y',
		'Ỿ': 'Y',
		'Ȳ': 'Y',
		'Ɏ': 'Y',
		'Ỹ': 'Y',
		'Ź': 'Z',
		'Ž': 'Z',
		'Ẑ': 'Z',
		'Ⱬ': 'Z',
		'Ż': 'Z',
		'Ẓ': 'Z',
		'Ȥ': 'Z',
		'Ẕ': 'Z',
		'Ƶ': 'Z',
		'Ĳ': 'IJ',
		'Œ': 'OE',
		'ᴀ': 'A',
		'ᴁ': 'AE',
		'ʙ': 'B',
		'ᴃ': 'B',
		'ᴄ': 'C',
		'ᴅ': 'D',
		'ᴇ': 'E',
		'ꜰ': 'F',
		'ɢ': 'G',
		'ʛ': 'G',
		'ʜ': 'H',
		'ɪ': 'I',
		'ʁ': 'R',
		'ᴊ': 'J',
		'ᴋ': 'K',
		'ʟ': 'L',
		'ᴌ': 'L',
		'ᴍ': 'M',
		'ɴ': 'N',
		'ᴏ': 'O',
		'ɶ': 'OE',
		'ᴐ': 'O',
		'ᴕ': 'OU',
		'ᴘ': 'P',
		'ʀ': 'R',
		'ᴎ': 'N',
		'ᴙ': 'R',
		'ꜱ': 'S',
		'ᴛ': 'T',
		'ⱻ': 'E',
		'ᴚ': 'R',
		'ᴜ': 'U',
		'ᴠ': 'V',
		'ᴡ': 'W',
		'ʏ': 'Y',
		'ᴢ': 'Z',
		'á': 'a',
		'ă': 'a',
		'ắ': 'a',
		'ặ': 'a',
		'ằ': 'a',
		'ẳ': 'a',
		'ẵ': 'a',
		'ǎ': 'a',
		'â': 'a',
		'ấ': 'a',
		'ậ': 'a',
		'ầ': 'a',
		'ẩ': 'a',
		'ẫ': 'a',
		'ä': 'a',
		'ǟ': 'a',
		'ȧ': 'a',
		'ǡ': 'a',
		'ạ': 'a',
		'ȁ': 'a',
		'à': 'a',
		'ả': 'a',
		'ȃ': 'a',
		'ā': 'a',
		'ą': 'a',
		'ᶏ': 'a',
		'ẚ': 'a',
		'å': 'a',
		'ǻ': 'a',
		'ḁ': 'a',
		'ⱥ': 'a',
		'ã': 'a',
		'ꜳ': 'aa',
		'æ': 'ae',
		'ǽ': 'ae',
		'ǣ': 'ae',
		'ꜵ': 'ao',
		'ꜷ': 'au',
		'ꜹ': 'av',
		'ꜻ': 'av',
		'ꜽ': 'ay',
		'ḃ': 'b',
		'ḅ': 'b',
		'ɓ': 'b',
		'ḇ': 'b',
		'ᵬ': 'b',
		'ᶀ': 'b',
		'ƀ': 'b',
		'ƃ': 'b',
		'ɵ': 'o',
		'ć': 'c',
		'č': 'c',
		'ç': 'c',
		'ḉ': 'c',
		'ĉ': 'c',
		'ɕ': 'c',
		'ċ': 'c',
		'ƈ': 'c',
		'ȼ': 'c',
		'ď': 'd',
		'ḑ': 'd',
		'ḓ': 'd',
		'ȡ': 'd',
		'ḋ': 'd',
		'ḍ': 'd',
		'ɗ': 'd',
		'ᶑ': 'd',
		'ḏ': 'd',
		'ᵭ': 'd',
		'ᶁ': 'd',
		'đ': 'd',
		'ɖ': 'd',
		'ƌ': 'd',
		'ı': 'i',
		'ȷ': 'j',
		'ɟ': 'j',
		'ʄ': 'j',
		'ǳ': 'dz',
		'ǆ': 'dz',
		'é': 'e',
		'ĕ': 'e',
		'ě': 'e',
		'ȩ': 'e',
		'ḝ': 'e',
		'ê': 'e',
		'ế': 'e',
		'ệ': 'e',
		'ề': 'e',
		'ể': 'e',
		'ễ': 'e',
		'ḙ': 'e',
		'ë': 'e',
		'ė': 'e',
		'ẹ': 'e',
		'ȅ': 'e',
		'è': 'e',
		'ẻ': 'e',
		'ȇ': 'e',
		'ē': 'e',
		'ḗ': 'e',
		'ḕ': 'e',
		'ⱸ': 'e',
		'ę': 'e',
		'ᶒ': 'e',
		'ɇ': 'e',
		'ẽ': 'e',
		'ḛ': 'e',
		'ꝫ': 'et',
		'ḟ': 'f',
		'ƒ': 'f',
		'ᵮ': 'f',
		'ᶂ': 'f',
		'ǵ': 'g',
		'ğ': 'g',
		'ǧ': 'g',
		'ģ': 'g',
		'ĝ': 'g',
		'ġ': 'g',
		'ɠ': 'g',
		'ḡ': 'g',
		'ᶃ': 'g',
		'ǥ': 'g',
		'ḫ': 'h',
		'ȟ': 'h',
		'ḩ': 'h',
		'ĥ': 'h',
		'ⱨ': 'h',
		'ḧ': 'h',
		'ḣ': 'h',
		'ḥ': 'h',
		'ɦ': 'h',
		'ẖ': 'h',
		'ħ': 'h',
		'ƕ': 'hv',
		'í': 'i',
		'ĭ': 'i',
		'ǐ': 'i',
		'î': 'i',
		'ï': 'i',
		'ḯ': 'i',
		'ị': 'i',
		'ȉ': 'i',
		'ì': 'i',
		'ỉ': 'i',
		'ȋ': 'i',
		'ī': 'i',
		'į': 'i',
		'ᶖ': 'i',
		'ɨ': 'i',
		'ĩ': 'i',
		'ḭ': 'i',
		'ꝺ': 'd',
		'ꝼ': 'f',
		'ᵹ': 'g',
		'ꞃ': 'r',
		'ꞅ': 's',
		'ꞇ': 't',
		'ꝭ': 'is',
		'ǰ': 'j',
		'ĵ': 'j',
		'ʝ': 'j',
		'ɉ': 'j',
		'ḱ': 'k',
		'ǩ': 'k',
		'ķ': 'k',
		'ⱪ': 'k',
		'ꝃ': 'k',
		'ḳ': 'k',
		'ƙ': 'k',
		'ḵ': 'k',
		'ᶄ': 'k',
		'ꝁ': 'k',
		'ꝅ': 'k',
		'ĺ': 'l',
		'ƚ': 'l',
		'ɬ': 'l',
		'ľ': 'l',
		'ļ': 'l',
		'ḽ': 'l',
		'ȴ': 'l',
		'ḷ': 'l',
		'ḹ': 'l',
		'ⱡ': 'l',
		'ꝉ': 'l',
		'ḻ': 'l',
		'ŀ': 'l',
		'ɫ': 'l',
		'ᶅ': 'l',
		'ɭ': 'l',
		'ł': 'l',
		'ǉ': 'lj',
		'ſ': 's',
		'ẜ': 's',
		'ẛ': 's',
		'ẝ': 's',
		'ḿ': 'm',
		'ṁ': 'm',
		'ṃ': 'm',
		'ɱ': 'm',
		'ᵯ': 'm',
		'ᶆ': 'm',
		'ń': 'n',
		'ň': 'n',
		'ņ': 'n',
		'ṋ': 'n',
		'ȵ': 'n',
		'ṅ': 'n',
		'ṇ': 'n',
		'ǹ': 'n',
		'ɲ': 'n',
		'ṉ': 'n',
		'ƞ': 'n',
		'ᵰ': 'n',
		'ᶇ': 'n',
		'ɳ': 'n',
		'ñ': 'n',
		'ǌ': 'nj',
		'ó': 'o',
		'ŏ': 'o',
		'ǒ': 'o',
		'ô': 'o',
		'ố': 'o',
		'ộ': 'o',
		'ồ': 'o',
		'ổ': 'o',
		'ỗ': 'o',
		'ö': 'o',
		'ȫ': 'o',
		'ȯ': 'o',
		'ȱ': 'o',
		'ọ': 'o',
		'ő': 'o',
		'ȍ': 'o',
		'ò': 'o',
		'ỏ': 'o',
		'ơ': 'o',
		'ớ': 'o',
		'ợ': 'o',
		'ờ': 'o',
		'ở': 'o',
		'ỡ': 'o',
		'ȏ': 'o',
		'ꝋ': 'o',
		'ꝍ': 'o',
		'ⱺ': 'o',
		'ō': 'o',
		'ṓ': 'o',
		'ṑ': 'o',
		'ǫ': 'o',
		'ǭ': 'o',
		'ø': 'o',
		'ǿ': 'o',
		'õ': 'o',
		'ṍ': 'o',
		'ṏ': 'o',
		'ȭ': 'o',
		'ƣ': 'oi',
		'ꝏ': 'oo',
		'ɛ': 'e',
		'ᶓ': 'e',
		'ɔ': 'o',
		'ᶗ': 'o',
		'ȣ': 'ou',
		'ṕ': 'p',
		'ṗ': 'p',
		'ꝓ': 'p',
		'ƥ': 'p',
		'ᵱ': 'p',
		'ᶈ': 'p',
		'ꝕ': 'p',
		'ᵽ': 'p',
		'ꝑ': 'p',
		'ꝙ': 'q',
		'ʠ': 'q',
		'ɋ': 'q',
		'ꝗ': 'q',
		'ŕ': 'r',
		'ř': 'r',
		'ŗ': 'r',
		'ṙ': 'r',
		'ṛ': 'r',
		'ṝ': 'r',
		'ȑ': 'r',
		'ɾ': 'r',
		'ᵳ': 'r',
		'ȓ': 'r',
		'ṟ': 'r',
		'ɼ': 'r',
		'ᵲ': 'r',
		'ᶉ': 'r',
		'ɍ': 'r',
		'ɽ': 'r',
		'ↄ': 'c',
		'ꜿ': 'c',
		'ɘ': 'e',
		'ɿ': 'r',
		'ś': 's',
		'ṥ': 's',
		'š': 's',
		'ṧ': 's',
		'ş': 's',
		'ŝ': 's',
		'ș': 's',
		'ṡ': 's',
		'ṣ': 's',
		'ṩ': 's',
		'ʂ': 's',
		'ᵴ': 's',
		'ᶊ': 's',
		'ȿ': 's',
		'ɡ': 'g',
		'ᴑ': 'o',
		'ᴓ': 'o',
		'ᴝ': 'u',
		'ť': 't',
		'ţ': 't',
		'ṱ': 't',
		'ț': 't',
		'ȶ': 't',
		'ẗ': 't',
		'ⱦ': 't',
		'ṫ': 't',
		'ṭ': 't',
		'ƭ': 't',
		'ṯ': 't',
		'ᵵ': 't',
		'ƫ': 't',
		'ʈ': 't',
		'ŧ': 't',
		'ᵺ': 'th',
		'ɐ': 'a',
		'ᴂ': 'ae',
		'ǝ': 'e',
		'ᵷ': 'g',
		'ɥ': 'h',
		'ʮ': 'h',
		'ʯ': 'h',
		'ᴉ': 'i',
		'ʞ': 'k',
		'ꞁ': 'l',
		'ɯ': 'm',
		'ɰ': 'm',
		'ᴔ': 'oe',
		'ɹ': 'r',
		'ɻ': 'r',
		'ɺ': 'r',
		'ⱹ': 'r',
		'ʇ': 't',
		'ʌ': 'v',
		'ʍ': 'w',
		'ʎ': 'y',
		'ꜩ': 'tz',
		'ú': 'u',
		'ŭ': 'u',
		'ǔ': 'u',
		'û': 'u',
		'ṷ': 'u',
		'ü': 'u',
		'ǘ': 'u',
		'ǚ': 'u',
		'ǜ': 'u',
		'ǖ': 'u',
		'ṳ': 'u',
		'ụ': 'u',
		'ű': 'u',
		'ȕ': 'u',
		'ù': 'u',
		'ủ': 'u',
		'ư': 'u',
		'ứ': 'u',
		'ự': 'u',
		'ừ': 'u',
		'ử': 'u',
		'ữ': 'u',
		'ȗ': 'u',
		'ū': 'u',
		'ṻ': 'u',
		'ų': 'u',
		'ᶙ': 'u',
		'ů': 'u',
		'ũ': 'u',
		'ṹ': 'u',
		'ṵ': 'u',
		'ᵫ': 'ue',
		'ꝸ': 'um',
		'ⱴ': 'v',
		'ꝟ': 'v',
		'ṿ': 'v',
		'ʋ': 'v',
		'ᶌ': 'v',
		'ⱱ': 'v',
		'ṽ': 'v',
		'ꝡ': 'vy',
		'ẃ': 'w',
		'ŵ': 'w',
		'ẅ': 'w',
		'ẇ': 'w',
		'ẉ': 'w',
		'ẁ': 'w',
		'ⱳ': 'w',
		'ẘ': 'w',
		'ẍ': 'x',
		'ẋ': 'x',
		'ᶍ': 'x',
		'ý': 'y',
		'ŷ': 'y',
		'ÿ': 'y',
		'ẏ': 'y',
		'ỵ': 'y',
		'ỳ': 'y',
		'ƴ': 'y',
		'ỷ': 'y',
		'ỿ': 'y',
		'ȳ': 'y',
		'ẙ': 'y',
		'ɏ': 'y',
		'ỹ': 'y',
		'ź': 'z',
		'ž': 'z',
		'ẑ': 'z',
		'ʑ': 'z',
		'ⱬ': 'z',
		'ż': 'z',
		'ẓ': 'z',
		'ȥ': 'z',
		'ẕ': 'z',
		'ᵶ': 'z',
		'ᶎ': 'z',
		'ʐ': 'z',
		'ƶ': 'z',
		'ɀ': 'z',
		'ﬀ': 'ff',
		'ﬃ': 'ffi',
		'ﬄ': 'ffl',
		'ﬁ': 'fi',
		'ﬂ': 'fl',
		'ĳ': 'ij',
		'œ': 'oe',
		'ﬆ': 'st',
		'ₐ': 'a',
		'ₑ': 'e',
		'ᵢ': 'i',
		'ⱼ': 'j',
		'ₒ': 'o',
		'ᵣ': 'r',
		'ᵤ': 'u',
		'ᵥ': 'v',
		'ₓ': 'x',
		'Ё': 'YO',
		'Й': 'I',
		'Ц': 'TS',
		'У': 'U',
		'К': 'K',
		'Е': 'E',
		'Н': 'N',
		'Г': 'G',
		'Ш': 'SH',
		'Щ': 'SCH',
		'З': 'Z',
		'Х': 'H',
		'Ъ': "'",
		'ё': 'yo',
		'й': 'i',
		'ц': 'ts',
		'у': 'u',
		'к': 'k',
		'е': 'e',
		'н': 'n',
		'г': 'g',
		'ш': 'sh',
		'щ': 'sch',
		'з': 'z',
		'х': 'h',
		'ъ': "'",
		'Ф': 'F',
		'Ы': 'I',
		'В': 'V',
		'А': 'a',
		'П': 'P',
		'Р': 'R',
		'О': 'O',
		'Л': 'L',
		'Д': 'D',
		'Ж': 'ZH',
		'Э': 'E',
		'ф': 'f',
		'ы': 'i',
		'в': 'v',
		'а': 'a',
		'п': 'p',
		'р': 'r',
		'о': 'o',
		'л': 'l',
		'д': 'd',
		'ж': 'zh',
		'э': 'e',
		'Я': 'Ya',
		'Ч': 'CH',
		'С': 'S',
		'М': 'M',
		'И': 'I',
		'Т': 'T',
		'Ь': "'",
		'Б': 'B',
		'Ю': 'YU',
		'я': 'ya',
		'ч': 'ch',
		'с': 's',
		'м': 'm',
		'и': 'i',
		'т': 't',
		'ь': "'",
		'б': 'b',
		'ю': 'yu'
		  };
	this.create();
	this.bindEvents();
};

Pickathing.prototype.create = function create () {
		var this$1 = this;

	this.addSelectedField();
	this.addDropdown();
	if (this.hasSearch) {
		this.addSearchField();
	}
	this.addList();

	for (var i = 0; i < this.options.length; i++) {
		this$1.addOption(this$1.options[i]);
	}

	this.checkFocusable();
	this.checkSelected();
};

Pickathing.prototype.checkFocusable = function checkFocusable () {
		var this$1 = this;

	this.focusableOptions = [];
	this.optionElements.map(function (el) {
		if (!el.disabled && el.offsetParent != null) {
			this$1.focusableOptions.push(el);
		}
	});
};

Pickathing.prototype.addSelectedField = function addSelectedField () {
	var tabindex = this.element.getAttribute('tabindex');

	if (tabindex == null) {
		tabindex = 0;
	}

	this.selectedField = document.createElement('div');
	this.selectedField.type = '';
	this.selectedField.setAttribute('data-client-input', '');
	this.selectedField.className = 'Pickathing-selectedField';
	this.selectedField.setAttribute('tabindex', tabindex);
	this.wrapper.appendChild(this.selectedField);
};

Pickathing.prototype.addDropdown = function addDropdown () {
	this.dropdown = document.createElement('div');
	this.dropdown.className = 'Pickathing-dropdown';
	this.wrapper.appendChild(this.dropdown);
};

Pickathing.prototype.addList = function addList () {
	this.list = document.createElement('div');
	this.list.className = 'Pickathing-list';
	this.dropdown.appendChild(this.list);
};
/**
	 * Adds input field for search
	 */
Pickathing.prototype.addSearchField = function addSearchField () {
	this.searchField = document.createElement('input');
	this.searchField.type = 'text';
	this.searchField.placeholder = this.searchFieldText;
	this.searchField.className = 'Pickathing-searchField';
	this.dropdown.appendChild(this.searchField);
};

Pickathing.prototype.addOption = function addOption (option) {
	var value = option.value;
	var text = option.innerHTML;
	var element = document.createElement('button');

	if (value == '' || option.disabled) {
		element.disabled = true;
	}

	element.type = 'button';

	element.innerHTML = text;
	element.className = 'Pickathing-option';
	element.setAttribute('data-option', value);
	element.setAttribute('data-label', text);

	var dataAttributes = [].filter.call(option.attributes, function (at) { return /^data-/.test(at.name); });
	if (dataAttributes.length > 0) {
		dataAttributes.map(function (data) {
			element.setAttribute(data.name, data.value);
		});
	}

	element.setAttribute('tabindex', '-1');
	this.list.appendChild(element);
	this.optionElements.push(element);
};

Pickathing.prototype.enable = function enable () {
	this.selectedField.disabled = false;
};

Pickathing.prototype.disable = function disable () {
	this.selectedField.disabled = true;
};

Pickathing.prototype.checkSelected = function checkSelected () {
		var this$1 = this;

	for (var i = 0; i < this.options.length; i++) {
		if (this$1.options[i].selected) {
			if (!this$1.multiple) {
				var label = this$1.optionElements[i].getAttribute('data-label');
				this$1.optionElements[i].classList.add('Pickathing-option--selected');
				this$1.selectedField.innerHTML = label;
				this$1.selectedOption = this$1.optionElements[i];

				return;
			} else {
				this$1.setMultiOption(this$1.optionElements[i]);
			}
		}
	}
};

Pickathing.prototype.setMultiOption = function setMultiOption (option) {
	option.classList.add('Pickathing-option--selected');
	var label = option.getAttribute('data-label');
	var value = option.getAttribute('data-option');
	var selectedFlag = document.createElement('span');
	var dataAttributes = [].filter.call(option.attributes, function (at) { return /^data-/.test(at.name); });
	if (dataAttributes.length > 0) {
		dataAttributes.map(function (data) {
			selectedFlag.setAttribute(data.name, data.value);
		});
	}
	selectedFlag.classList.add('Pickathing-selectedFlag');
	if (this.ignoreDiacritics) {
		selectedFlag.setAttribute('data-option', this.latinize(value));
	} else {
		selectedFlag.setAttribute('data-option', value);
	}
	selectedFlag.innerHTML = label;
	this.selectedField.appendChild(selectedFlag);
	this.value[value] = option;
};

Pickathing.prototype.triggerNativeChange = function triggerNativeChange () {
	console.log('"Pickathing.onChange" method is deprecated and will be removed in future releases. Please consider using native onchange event');
	if ("createEvent" in document) {
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change", false, true);
		    this.element.dispatchEvent(evt);
	} else {
		    this.element.fireEvent("onchange");
	}
};

Pickathing.prototype.onChange = function onChange () {
	// silence is golden
};

Pickathing.prototype.setOptionByIndex = function setOptionByIndex (index, fireOnChange) {
	var value = this.optionElements[index].getAttribute('data-option');
	var label = this.optionElements[index].getAttribute('data-label');

	this.optionElements.map(function (opt) {
		opt.classList.remove('Pickathing-option--selected');
	});

	this.optionElements[index].classList.add('Pickathing-option--selected');
	this.selectedField.innerHTML = label;
	this.element.value = value;
	this.value = value;
	this.selectedOption = this.optionElements[index];

	if (typeof fireOnChange == 'undefined' || fireOnChange == true) {
		this.onChange();
		this.triggerNativeChange();
	}
};

Pickathing.prototype.reset = function reset (fireOnChange) {
		var this$1 = this;

	if (!this.multiple) {
		this.setOptionByIndex(0, fireOnChange);
	} else {
		for (var val in this$1.value) {
			this$1.deselectMultiOption(val);
		}

		if (fireOnChange) {
			this.onChange();
			this.triggerNativeChange();
		}
	}

	this.checkFocusable();
};

Pickathing.prototype.deselectMultiOption = function deselectMultiOption (value) {
	var element = this.wrapper.querySelectorAll('.Pickathing-option[data-option="' + value + '"]');
	var flagToRemove = this.wrapper.querySelectorAll('.Pickathing-selectedFlag[data-option="' + value + '"]');
	var originalOption = this.element.querySelectorAll('option[value="' + value + '"]')[0];
	originalOption.selected = false;
	flagToRemove[0].remove();
	element[0].classList.remove('Pickathing-option--selected');
	delete this.value[value];
};

Pickathing.prototype.filter = function filter (query, field) {
	this.optionElements.map(function (el) {
		var label = el.getAttribute(field);
		el.style.display = 'block';
		if (label && query != null) {
			if (label.match(query)) {
				el.style.display = 'block';
			} else {
				el.style.display = 'none';
			}
		}
	});

	this.checkFocusable();
};

Pickathing.prototype.focusNextOption = function focusNextOption () {
	if (this.focusableOptions.length > this.focusedOption + 1) {
		this.focusedOption += 1;
		this.focusOption();
	}
};

Pickathing.prototype.focusPreviousOption = function focusPreviousOption () {
	if (this.hasSearch) {
		if (this.focusedOption > -1) {
			this.focusedOption -= 1;
			if (this.focusedOption == -1) {
				this.searchField.focus();
			} else {
				this.focusOption();
			}
		}
	} else {
		if (this.focusedOption > 0) {
			this.focusedOption -= 1;
			this.focusOption();
		}
	}
};

Pickathing.prototype.focusOption = function focusOption () {
	this.focusableOptions[this.focusedOption].focus();
};

Pickathing.prototype.toggleState = function toggleState () {
	var self = this;
	self.wrapper.classList.toggle('Pickathing--open');
	if (this.hasSearch) {
		this.focusedOption = -1;
	} else {
		this.focusedOption = 0;
	}
	if (self.hasSearch) {
		clearTimeout(self.transTimeout);
		self.transTimeout = setTimeout(function () {
			self.searchField.focus();
		}, self.transTimeoutDelay);
	} else {
		clearTimeout(self.transTimeout);
		self.transTimeout = setTimeout(function () {
			self.focusableOptions[0].focus();
		}, self.transTimeoutDelay);
	}
};

Pickathing.prototype.latinize = function latinize (toLatinize) {
		var this$1 = this;
		if ( toLatinize === void 0 ) toLatinize = '';

	var woDiacritics = '';
	for (var i = 0; i < toLatinize.length; i++) {
		woDiacritics += this$1.characters[toLatinize[i]] ? this$1.characters[toLatinize[i]] : toLatinize[i];
	}

	return woDiacritics;
};

Pickathing.prototype.bindEvents = function bindEvents () {
		var this$1 = this;

	if (this.hasSearch) {
		this.searchField.addEventListener('keyup', function (e) {
			var searchQuery = this$1.searchField.value;
			if (this$1.ignoreDiacritics) {
				searchQuery = this$1.latinize(searchQuery);
			}

			var query = new RegExp(searchQuery, 'gi');
			this$1.filter(query, 'data-label');
			this$1.checkFocusable();
		});
	}

	document.addEventListener('click', function (e) {
		var el = e.target;

		if (el != this$1.selectedField && el != this$1.searchField) {
			if (el.classList.contains('Pickathing-option') && this$1.multiple) {
				// do nothing
			} else {
				this$1.wrapper.classList.remove('Pickathing--open');
			}
		}
	});

	this.wrapper.addEventListener('click', function (e) {
		var el = e.target;
		if (el.classList.contains('Pickathing-option')) {

			if (!this$1.multiple) {
				this$1.wrapper.classList.remove('Pickathing--open');
			}

			var value = el.getAttribute('data-option');
			var label = el.getAttribute('data-label');

			this$1.focusedOption = this$1.focusableOptions.indexOf(el);

			if (!this$1.multiple) {
				this$1.optionElements.map(function (opt) {
					opt.classList.remove('Pickathing-option--selected');
				});
				el.classList.add('Pickathing-option--selected');
				this$1.selectedOption = el;
				this$1.selectedField.innerHTML = label;
				this$1.element.value = value;
				this$1.value = value;

				for (var i = 0, l = this$1.options.length; i < l; i++) {
					this$1.options[i].selected = false;
				}

				var originalOption = this$1.element.querySelectorAll('option[value="' + value + '"]')[0];
				originalOption.selected = true;
			} else {
				if (!el.classList.contains('Pickathing-option--selected')) {
					var selectedFlag = document.createElement('span');
					selectedFlag.classList.add('Pickathing-selectedFlag');
					selectedFlag.innerHTML = label;
					selectedFlag.setAttribute('data-option', value);
					var dataAttributes = [].filter.call(el.attributes, function (at) { return /^data-/.test(at.name); });
					if (dataAttributes.length > 0) {
						dataAttributes.map(function (data) {
							selectedFlag.setAttribute(data.name, data.value);
						});
					}
					var originalOption$1 = this$1.element.querySelectorAll('option[value="' + value + '"]')[0];
					originalOption$1.selected = true;
					this$1.value[value] = el;
					this$1.selectedField.appendChild(selectedFlag);
					el.classList.add('Pickathing-option--selected');
				} else {
					this$1.deselectMultiOption(value);
				}
			}

			if (self.filterAnother) {
				self.filterAnother.filter(self.selectedOption.getAttribute(self.filterAnotherBy), self.filterAnotherBy);
				if (!self.filterAnother.multiple
					&& self.filterAnother.selectedOption.getAttribute(self.filterAnotherBy) != self.selectedOption.getAttribute(self.filterAnotherBy)) {
					self.filterAnother.reset(false);
				}

				if (self.filterAnother.multiple) {
					self.filterAnother.reset(false);
				}
			}

			this$1.onChange(this$1.value);
			this$1.triggerNativeChange();
		}

		if (el.classList.contains('Pickathing-selectedField')) {
			e.preventDefault();
			this$1.toggleState();
		}

		if (el.classList.contains('Pickathing-selectedFlag')) {
			e.stopPropagation();
			if (this$1.wrapper.classList.contains('Pickathing--open')) {
				var flagToRemove = this$1.wrapper.querySelectorAll('.Pickathing-option--selected[data-option="' + el.getAttribute('data-option') + '"]');
				flagToRemove[0].classList.remove('Pickathing-option--selected');
				delete this$1.value[el.getAttribute('data-option')];
				el.remove();
			} else {
				this$1.wrapper.classList.add('Pickathing--open');
			}

			this$1.onChange(this$1.value);
			this$1.triggerNativeChange();
		}

	});

	this.wrapper.addEventListener('keyup', function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.which == 40) { // down arrow
			this$1.focusNextOption();
		} else if (e.which == 38) { // up arrow
			e.preventDefault();
			this$1.focusPreviousOption();
		} else if (e.which == 27) {
			this$1.toggleState();
		}
	});

	this.wrapper.addEventListener('keypress', function (e) {
		if (e.which == 40 || e.which == 38) {
			e.preventDefault();
		}
	});

	this.wrapper.addEventListener('keydown', function (e) {
		if (e.which == 40 || e.which == 38) {
			e.preventDefault();
		}
	});
};

})));

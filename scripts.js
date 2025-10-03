(() => {
	// Config
	const MAX = 250;

	// Elements
	const textarea = document.getElementById('message');
	const counter = document.getElementById('charCount');
	const wrap = textarea.parentElement;

	function updateCount(n){
		counter.textContent = n + ' / ' + MAX;
		if (n >= MAX) {
			wrap.classList.add('maxed');
		} else {
			wrap.classList.remove('maxed');
		}
	}

	function enforceLimit() {
		const value = textarea.value;
		if (value.length > MAX) {
			// trim to MAX and set cursor to end
			textarea.value = value.slice(0, MAX);
			// move caret to end
			textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
		}
		updateCount(textarea.value.length);
	}

	// input covers typing, deletion, and most paste events
	textarea.addEventListener('input', enforceLimit);

	// Prevent key presses that would exceed the limit (helps a11y)
	textarea.addEventListener('keydown', (e) => {
		const allowedKeys = [8,46,37,38,39,40]; // backspace, delete, arrows
		if (allowedKeys.includes(e.keyCode)) return;
		const selStart = textarea.selectionStart;
		const selEnd = textarea.selectionEnd;
		const currentLen = textarea.value.length;
		const selectionLen = selEnd - selStart;
		if (currentLen - selectionLen >= MAX) {
			// no space left
			e.preventDefault();
		}
	});

	// Ensure pasted text is trimmed
	textarea.addEventListener('paste', (e) => {
		const paste = (e.clipboardData || window.clipboardData).getData('text');
		const selStart = textarea.selectionStart;
		const selEnd = textarea.selectionEnd;
		const before = textarea.value.slice(0, selStart);
		const after = textarea.value.slice(selEnd);
		const allowed = MAX - (before.length + after.length);
		if (allowed <= 0) {
			// nothing allowed
			e.preventDefault();
			return;
		}
		if (paste.length > allowed) {
			e.preventDefault();
			const toInsert = paste.slice(0, allowed);
			const newVal = before + toInsert + after;
			textarea.value = newVal;
			// set caret after inserted text
			const pos = before.length + toInsert.length;
			textarea.selectionStart = textarea.selectionEnd = pos;
			updateCount(textarea.value.length);
		}
	});

	// initialise
	updateCount(0);

})();

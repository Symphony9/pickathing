class Pickathing {
	constructor(elementId, hasSearch) {
		this.element = document.getElementById(elementId);
		this.parentEl = this.element.parentNode;
		this.hasSearch = typeof hasSearch === 'undefined' ? true : hasSearch;
		this.required = this.element.hasAttribute('data-required');

		this.wrapper = document.createElement('div');
		this.wrapper.className = 'Pickathing';
		this.wrapper = this.parentEl.insertBefore(this.wrapper, this.element);

		if (this.required) {
			this.wrapper.setAttribute('data-required', '');
			this.element.removeAttribute('data-required');
		}

		this.optionElements = [];
		this.options = this.element.options;
		this.value = this.element.value;

		this.searchField;

		this.create();
		this.bindEvents();
	}

	create() {
		let self = this;

		this.addSelectedField();
		this.addDropdown();
		if (this.hasSearch) {
			this.addSearchField();
		}
		this.addList();

		for (let i = 0; i < this.options.length; i++) {
			self.addOption(self.options[i]);
		}

		this.checkSelected();
	}

	addSelectedField() {
		this.selectedField = document.createElement('button');
		this.selectedField.type = '';
		this.selectedField.setAttribute('data-client-input', '');
		this.selectedField.className = 'Pickathing-selectedField';
		this.wrapper.appendChild(this.selectedField);
	}

	addDropdown() {
		this.dropdown = document.createElement('div');
		this.dropdown.className = 'Pickathing-dropdown';
		this.wrapper.appendChild(this.dropdown);
	}

	addList() {
		this.list = document.createElement('div');
		this.list.className = 'Pickathing-list';
		this.dropdown.appendChild(this.list);
	}

	addSearchField() {
		this.searchField = document.createElement('input');
		this.searchField.type = 'text';
		this.searchField.className = 'Pickathing-searchField';
		this.dropdown.appendChild(this.searchField);
	}

	addOption(option) {
		let value = option.value;
		let text = option.innerHTML;
		let element;

		if (value == '') {
			element = document.createElement('button');
			element.disabled = true;
		} else {
			element = document.createElement('div');
		}

		element.innerHTML = text;
		element.className = 'Pickathing-option'
		element.setAttribute('data-option', value);
		element.setAttribute('data-label', text);
		this.list.appendChild(element);
		this.optionElements.push(element);
	}

	enable() {
		this.selectedField.disabled = false;
	}

	disable() {
		this.selectedField.disabled = true;
	}

	checkSelected() {
		for (let i = 0; i < this.options.length; i++) {
			if (this.options[i].selected) {
				let label = this.optionElements[i].getAttribute('data-label');

				this.selectedField.innerHTML = label;

				return;
			}
		}
	}

	setOption(value) {
		let option = this.wrapper.querySelectorAll('[data-option="' + value + '"]');
		let label = option[0].getAttribute('data-label');

		this.selectedField.innerHTML = label;
		this.element.value = value;
		this.value = value;
	}

	onChange() {
		// silence is golden
	}

	bindEvents() {
		let self = this;
		if (this.hasSearch) {
			this.searchField.addEventListener('keyup', (e) => {
				let query = new RegExp(self.searchField.value, 'gi');

				self.optionElements.map((el) => {
					let label = el.getAttribute('data-label');
					if (label.match(query)) {
						el.style.display = 'block';
					} else {
						el.style.display = 'none';
					}
				});
			});
		}

		document.addEventListener('click', (e) => {
			let el = e.target;

			if (el != this.selectedField && el != this.searchField) {
				this.optionElements.map((option) => {
					if (el == option) {
						return;
					}
				});

				this.wrapper.classList.remove('Pickathing--open');
			}
		});

		this.wrapper.addEventListener('click', (e) => {
			let el = e.target;
			if (el.classList.contains('Pickathing-option')) {
				self.wrapper.classList.remove('Pickathing--open');
				let value = el.getAttribute('data-option');
				let label = el.getAttribute('data-label');

				this.selectedField.innerHTML = label;
				this.element.value = value;
				this.value = value;

				this.onChange(this.value);
			}

			if (el.classList.contains('Pickathing-selectedField')) {
				e.preventDefault();
				self.wrapper.classList.toggle('Pickathing--open');
			}
		});
	}
}
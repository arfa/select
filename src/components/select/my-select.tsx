import { Component, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'my-select',
  styleUrl: 'my-select.css',
  shadow: false,
})
export class MySelect {
  @Prop({ mutable: true }) options: { label: any; value: string }[] = [];
  @Prop() multiSelect: boolean = false;
  @Prop() enableSearch: boolean = false;
  @Prop() enableSelectAll: boolean = false;
  @Prop() enableSelectedItems: boolean = false;
  @Prop() defaultValue?: string | string[];
  @Prop() placeholder: string = 'Choose an option';
  @Prop() disabled: boolean = false;
  @Prop() selectedItemsLabel: string = 'Selected item(s)';
  @Prop() ListLabel: string = 'List';

  @State() isOpen: boolean = false;
  @State() selected: { label: any; value: string }[] = [];
  @State() searchQuery: string = '';
  @State() dropdownPosition: 'bottom' | 'top' = 'bottom';

  @Event() valueChanged: EventEmitter<string | string[]>;

  @Element() el!: HTMLElement;

  componentWillLoad() {
    this.initializeDefaultSelection();
  }

  initializeDefaultSelection() {
    if (this.defaultValue) {
      const defaultValues = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue];
      this.selected = this.options.filter(option => defaultValues.includes(option.value));
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      setTimeout(() => this.checkDropdownPosition(), 0); // Wait for render
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      this.resetSearch(); // Reset search when closing
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  checkDropdownPosition() {
    const selectBox = this.el.querySelector('.select-box');
    const dropdown = this.el.querySelector('.dropdown');

    if (selectBox && dropdown) {
      const selectBoxRect = selectBox.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const dropdownHeight = dropdownRect.height; // Get visible height

      const spaceBelow = window.innerHeight - selectBoxRect.bottom;
      const spaceAbove = selectBoxRect.top;

      // Set dropdown position based on available space
      this.dropdownPosition = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom';
    }
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.el.contains(event.target as Node)) {
      this.isOpen = false;
      this.resetSearch(); // Reset search when closing
      document.removeEventListener('click', this.handleOutsideClick);
    }
  };

  selectOption(option: { label: any; value: string }) {
    if (this.multiSelect) {
      // Toggle selection in multi-select mode
      const isSelected = this.selected.some(sel => sel.value === option.value);
      this.selected = isSelected
        ? this.selected.filter(sel => sel.value !== option.value) // Remove if already selected
        : [...this.selected, option]; // Add if not selected
      this.valueChanged.emit(this.selected.map(sel => sel.value)); // Emit array
    } else {
      // Single select mode
      this.selected = [option];
      this.isOpen = false;
      this.valueChanged.emit(option.value);
      this.resetSearch(); // Reset search when closing
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  clearSelection(event: Event) {
    event.stopPropagation(); // Prevent dropdown toggle when clearing
    this.selected = [];
    this.valueChanged.emit(this.multiSelect ? [] : '');
  }

  handleSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  resetSearch() {
    this.searchQuery = ''; // Clear search query when dropdown closes
  }

  toggleSelectAll(event: Event) {
    event.stopPropagation();
    if (this.selected.length === this.options.length) {
      this.selected = []; // Deselect all
    } else {
      this.selected = [...this.options]; // Select all
    }
    this.valueChanged.emit(this.selected.map(sel => sel.value));
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  getItemSelectedLabel() {
    if (this.selected.length === 0) {
      return this.placeholder;
    } else if (this.selected.length === 1) {
      return this.selected[0].label;
    } else {
      return (
        <span class="counter-wrapper">
          <span class="counter">{this.selected.length}</span>
          <span class="counter-text">items selected</span>
        </span>
      );
    }
  }

  getTitle() {
    if (this.selected.length === 0) {
      return this.placeholder;
    } else if (this.selected.length === 1) {
      return this.selected[0].label;
    } else {
      return this.selected.map(sel => sel.label).join(', ');
    }
  }

  render() {
    const filteredOptions = this.enableSearch ? this.options.filter(option => option.label.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) : this.options;

    const isAllSelected = this.selected.length === this.options.length;

    return (
      <div class="select-container">
        <button class="select-box" onClick={() => this.toggleDropdown()} disabled={this.disabled}>
          <span title={this.getTitle()}>{this.getItemSelectedLabel()}</span>
          <div class="buttons">
            {this.selected.length > 0 && (
              <span class="clear-btn" onClick={event => !this.disabled && this.clearSelection(event)}>
                ✖
              </span>
            )}
            <span class="toggle-btn">{this.isOpen ? '▲' : '▼'}</span>
          </div>
        </button>
        {this.isOpen && (
          <div class={`dropdown ${this.dropdownPosition}`}>
            {this.enableSearch && (
              <div class="search-container">
                <input type="text" placeholder="Search..." value={this.searchQuery} onInput={event => this.handleSearch(event)} />
              </div>
            )}
            {this.enableSelectedItems && this.multiSelect && this.selected.length > 0 && !this.searchQuery && (
              <div class="selected-items-title">
                <span>{this.selectedItemsLabel}</span>
              </div>
            )}
            <ul>
              {this.enableSelectedItems && this.multiSelect && this.selected.length > 0 && !this.searchQuery && (
                <div class="selected-items">
                  {this.selected.map(option => {
                    return (
                      <li key={option.value} class="selected" onClick={() => this.selectOption(option)} tabIndex={0}>
                        <input type="checkbox" checked tabIndex={-1} />
                        <span class="option-label" title={option.label}>
                          {option.label}
                        </span>
                      </li>
                    );
                  })}
                </div>
              )}
            </ul>
            {this.multiSelect && this.enableSelectAll && (
              <div class="select-all" onClick={event => this.toggleSelectAll(event)} tabIndex={0}>
                <input type="checkbox" checked={isAllSelected} tabIndex={-1} />
                <span>Select All</span>
              </div>
            )}
            {this.enableSelectedItems && this.multiSelect && this.selected.length > 0 && <div class="options-title">{this.ListLabel}</div>}
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  const isSelected = this.selected.some(sel => sel.value === option.value);
                  return (
                    <li key={option.value} class={isSelected ? 'selected' : ''} onClick={() => this.selectOption(option)} tabIndex={0}>
                      {this.multiSelect && <input type="checkbox" checked={isSelected} tabIndex={-1} />}
                      <span class="option-label" title={option.label}>
                        {option.label}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li class="no-results">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

import { Component, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'my-select',
  styleUrl: 'my-select.css',
  shadow: false,
})
export class MySelect {
  @Prop() label: string = 'Select an option';
  @Prop() options: { label: any; value: string }[] = [];
  @Prop() multiSelect: boolean = false;
  @Prop() enableSearch: boolean = false;
  @Prop() enableSelectAll: boolean = false;

  @State() isOpen: boolean = false;
  @State() selected: { label: any; value: string }[] = [];
  @State() searchQuery: string = '';

  @Event() valueChanged: EventEmitter<string | string[]>;

  @Element() el!: HTMLElement;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent unwanted dropdown toggling
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      this.resetSearch(); // Reset search when closing
      document.removeEventListener('click', this.handleOutsideClick);
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
      return 'Choose an option';
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

  render() {
    const filteredOptions = this.enableSearch ? this.options.filter(option => option.label.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) : this.options;

    const isAllSelected = this.selected.length === this.options.length;

    return (
      <div class="select-container">
        <label>{this.label}</label>
        <div class="select-box" onClick={event => this.toggleDropdown(event)}>
          <span onClick={event => this.toggleDropdown(event)}>{this.getItemSelectedLabel()}</span>
          <div class="buttons">
            {this.selected.length > 0 && (
              <button class="clear-btn" onClick={event => this.clearSelection(event)}>
                ✖
              </button>
            )}
            <button class="toggle-btn" onClick={event => this.toggleDropdown(event)}>
              {this.isOpen ? '▲' : '▼'}
            </button>
          </div>
        </div>
        {this.isOpen && (
          <div class="dropdown">
            {this.enableSearch && (
              <div class="search-container">
                <input type="text" placeholder="Search..." value={this.searchQuery} onInput={event => this.handleSearch(event)} />
              </div>
            )}
            {this.multiSelect && this.enableSelectAll && (
              <div class="select-all" onClick={event => this.toggleSelectAll(event)}>
                <input type="checkbox" checked={isAllSelected} />
                <span>Select All</span>
              </div>
            )}
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  const isSelected = this.selected.some(sel => sel.value === option.value);
                  return (
                    <li class={isSelected ? 'selected' : ''} onClick={() => this.selectOption(option)}>
                      {this.multiSelect && <input type="checkbox" checked={isSelected} />}
                      {option.label}
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

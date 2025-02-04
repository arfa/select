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

  @State() isOpen: boolean = false;
  @State() selected: { label: any; value: string }[] = [];

  @Event() valueChanged: EventEmitter<string | string[]>;

  @Element() el!: HTMLElement;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent unwanted dropdown toggling
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      document.addEventListener('click', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.el.contains(event.target as Node)) {
      this.isOpen = false;
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
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  clearSelection(event: Event) {
    event.stopPropagation(); // Prevent dropdown toggle when clearing
    this.selected = [];
    this.valueChanged.emit(this.multiSelect ? [] : '');
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
      return `${this.selected.length} items selected`;
    }
  }

  render() {
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
          <ul class="dropdown">
            {this.options.map(option => {
              const isSelected = this.selected.some(sel => sel.value === option.value);
              return (
                <li class={isSelected ? 'selected' : ''} onClick={() => this.selectOption(option)}>
                  {this.multiSelect && <input type="checkbox" checked={isSelected} />}
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

import { Component, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'my-select',
  styleUrl: 'my-select.css',
  shadow: false,
})
export class MySelect {
  @Prop() label: string = 'Select an option';
  @Prop() options: { label: any; value: string }[] = [];
  @State() isOpen: boolean = false;
  @State() selected: { label: any; value: string } | null = null;

  @Event() valueChanged: EventEmitter<string>;

  @Element() el!: HTMLElement;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent click propagation when opening
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
    this.selected = option;
    this.isOpen = false;
    this.valueChanged.emit(option.value);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  clearSelection(event: Event) {
    event.stopPropagation(); // Prevent dropdown toggle when clearing
    this.selected = null;
    this.valueChanged.emit('');
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  render() {
    return (
      <div class="select-container">
        <label>{this.label}</label>
        <div class="select-box" onClick={event => this.toggleDropdown(event)}>
          <span>{this.selected ? this.selected.label : 'Choose an option'}</span>
          <div class="buttons">
            {this.selected && (
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
            {this.options.map(option => (
              <li class={option.value === this.selected?.value ? 'selected' : ''} onClick={() => this.selectOption(option)}>
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

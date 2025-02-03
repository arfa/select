import { Component, h, Prop, State, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'my-select',
  styleUrl: 'my-select.css',
  shadow: true,
})
export class MySelect {
  @Prop() label: string = 'Select an option';
  @Prop() options: string[] = [];
  @State() isOpen: boolean = false;
  @State() selected: string = '';

  @Event() valueChanged: EventEmitter<string>;

  @Element() el!: HTMLElement;

  toggleDropdown() {
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

  selectOption(option: string) {
    this.selected = option;
    this.isOpen = false;
    this.valueChanged.emit(option);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  render() {
    return (
      <div class="select-container">
        <label>{this.label}</label>
        <div class="select-box" onClick={() => this.toggleDropdown()}>
          <span>{this.selected || 'Choose an option'}</span>
          <button>{this.isOpen ? '▲' : '▼'}</button>
        </div>
        {this.isOpen && (
          <ul class="dropdown">
            {this.options.map(option => (
              <li class={option === this.selected ? 'selected' : ''} onClick={() => this.selectOption(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

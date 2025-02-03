import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-app',
  shadow: false,
})
export class MyApp {
  private options = [
    { label: 'First Item', value: 'first' },
    { label: 'Second Item', value: 'second' },
  ];

  handleOptionSelected(event: CustomEvent<string>) {
    console.log('Option selected:', event.detail);
  }

  render() {
    return (
      <div>
        <my-select options={this.options} onValueChanged={event => this.handleOptionSelected(event)}></my-select>
      </div>
    );
  }
}

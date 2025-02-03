import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-app',
  shadow: false,
})
export class MyApp {
  private options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  handleOptionSelected(event: CustomEvent<string>) {
    console.log('Option selected:', event.detail);
  }

  render() {
    return (
      <div>
        <my-select options={this.options} />
      </div>
    );
  }
}

import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-app',
  shadow: false,
})
export class MyApp {
  private options = [
    { label: 'First Item', value: 'first' },
    { label: 'Second Item', value: 'second' },
    { label: 'Third Item', value: 'third' },
    { label: 'Fourth Item', value: 'fourth' },
    { label: 'Fifth Item', value: 'fifth' },
    { label: 'Sixth Item', value: 'sixth' },
    { label: 'Seventh Item', value: 'seventh' },
    { label: 'Eighth Item', value: 'eighth' },
  ];

  handleOptionSelected(event: CustomEvent<string[] | string>) {
    console.log('Option selected:', event.detail);
  }

  render() {
    return (
      <div>
        <my-select options={this.options} multiSelect enableSearch onValueChanged={(event: CustomEvent<string[] | string>) => this.handleOptionSelected(event)}></my-select>
      </div>
    );
  }
}

import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-app',
  shadow: false,
})
export class MyApp {
  private options = [
    { label: 'Very Looooooooooong First Item', value: 'long' },
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
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo accusamus suscipit nostrum, excepturi exercitationem maxime libero, quia voluptatum facilis minus
          laudantium ad nobis nam sint saepe maiores vero dolor. Nostrum.
        </p>
        <my-select
          options={this.options}
          multiSelect
          enableSelectedItems
          enableSelectAll
          enableSearch
          defaultValue={['first', 'third']}
          onValueChanged={(event: CustomEvent<string[] | string>) => this.handleOptionSelected(event)}
        ></my-select>
      </div>
    );
  }
}

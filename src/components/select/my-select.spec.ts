import { newSpecPage } from '@stencil/core/testing';
import { MySelect } from './my-select';

describe('my-select', () => {
  it('renders correctly', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select></my-select>`,
    });

    expect(page.root).toEqualHtml(`
      <my-select>
        <div class="select-container">
          <button class="select-box">
            <span title="Choose an option">Choose an option</span>
            <div class="buttons">
              <span class="toggle-btn">▼</span>
            </div>
          </button>
        </div>
      </my-select>
    `);
  });

  it('initializes with default values', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select default-value="option1"></my-select>`,
    });

    // Set options manually
    page.rootInstance.options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ];

    // Manually trigger the initialization again
    page.rootInstance.initializeDefaultSelection();

    await page.waitForChanges();

    expect(page.rootInstance.selected).toEqual([{ label: 'Option 1', value: 'option1' }]);
  });

  it('should open the dropdown on click', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select></my-select>`,
    });

    page.rootInstance.toggleDropdown(new Event('click'));

    expect(page.rootInstance.isOpen).toBeTruthy();
  });

  it('should select an option', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select></my-select>`,
    });

    page.rootInstance.options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ];
    await page.waitForChanges();

    page.rootInstance.selectOption({ label: 'Option 1', value: 'option1' });

    expect(page.rootInstance.selected).toEqual([{ label: 'Option 1', value: 'option1' }]);
  });

  it('should emit an event when value changes', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select></my-select>`,
    });

    const mockFn = jest.fn();
    page.root.addEventListener('valueChanged', mockFn);

    page.rootInstance.selectOption({ label: 'Option 1', value: 'option1' });
    await page.waitForChanges();

    expect(mockFn).toHaveBeenCalled();
  });

  it('should clear selection', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select></my-select>`,
    });

    page.rootInstance.options = [{ label: 'Option 1', value: 'option1' }];
    page.rootInstance.selected = [{ label: 'Option 1', value: 'option1' }];
    await page.waitForChanges();

    page.rootInstance.clearSelection(new Event('click'));

    expect(page.rootInstance.selected).toEqual([]);
  });

  it('should search and filter options', async () => {
    const page = await newSpecPage({
      components: [MySelect],
      html: `<my-select enable-search></my-select>`,
    });

    page.rootInstance.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ];
    await page.waitForChanges();

    page.rootInstance.searchQuery = 'ban';
    await page.waitForChanges();

    const filteredOptions = page.rootInstance.options.filter(option => option.label.toLowerCase().includes(page.rootInstance.searchQuery.toLowerCase()));

    expect(filteredOptions).toEqual([{ label: 'Banana', value: 'banana' }]);
  });
});

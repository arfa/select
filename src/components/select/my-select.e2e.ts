import { newE2EPage } from '@stencil/core/testing';

describe('my-select E2E', () => {
  it('renders correctly', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-select></my-select>');

    await page.waitForChanges(); // Ensure rendering
    const element = await page.find('my-select');
    expect(element).not.toBeNull();
  });

  it('should open the dropdown on click', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-select></my-select>');

    await page.waitForSelector('my-select .select-box'); // Ensure it's rendered
    const selectBox = await page.find('my-select .select-box');

    expect(selectBox).not.toBeNull(); // Check before interacting
    await selectBox.click();

    await page.waitForSelector('my-select .dropdown'); // Ensure dropdown appears
    const dropdown = await page.find('my-select .dropdown');
    expect(dropdown).not.toBeNull();
  });

  it('should select an option', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-select></my-select>');

    // Set options manually
    await page.$eval('my-select', (el: any) => {
      el.options = [{ label: 'Option 1', value: 'option1' }];
    });

    await page.waitForChanges(); // Ensure updates are applied

    // Open the dropdown
    const selectBox = await page.find('my-select .select-box');
    await selectBox.click();

    // Select the option
    const option = await page.find('my-select .dropdown li');
    expect(option).not.toBeNull();
    await option.click();

    // Ensure the selected value is displayed
    const selected = await page.find('my-select .select-box span');
    expect(await selected.innerText).toBe('Option 1');
  });

  it('should allow multi-selection', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-select multi-select enable-select-all></my-select>');

    // Set options manually
    await page.$eval('my-select', (el: any) => {
      el.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ];
    });

    await page.waitForChanges(); // Ensure options are set

    const selectBox = await page.find('my-select .select-box');
    await selectBox.click();

    const selectAll = await page.find('my-select .select-all');
    expect(selectAll).not.toBeNull();
    await selectAll.click();

    const selected = await page.find('my-select .select-box span');
    expect(await selected.innerText).toContain('2items selected');
  });

  it('should reset search when dropdown closes', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-select enable-search></my-select>');

    await page.waitForSelector('my-select .select-box');
    const selectBox = await page.find('my-select .select-box');
    await selectBox.click();

    await page.waitForSelector('my-select input[type="text"]');
    const searchInput = await page.find('my-select input[type="text"]');
    await searchInput.type('test');

    await page.waitForSelector('my-select .dropdown');
    const dropdown = await page.find('my-select .dropdown');
    expect(dropdown).not.toBeNull();

    await selectBox.click(); // Close the dropdown
    await selectBox.click(); // Reopen dropdown

    const newSearchInput = await page.find('my-select input[type="text"]');
    expect(await newSearchInput.getProperty('value')).toBe('');
  });
});

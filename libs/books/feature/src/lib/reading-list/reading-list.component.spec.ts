import { $, $$, browser, ExpectedConditions, by, element } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should see my reading list and snackbar after adding book to Reading List', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('java');
    await form.submit();
    const readingListBooks = await $$('[data-testing="book-item"]');
    expect(readingListBooks.length).toBeGreaterThan(1);

    await $$('.book--content--info button:enabled').first().click();

    const readingListClickToggle = await $(
      '[data-testing="toggle-reading-list"]'
    );
    await readingListClickToggle.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    browser.sleep(2000);
  });

  it('Then: I should see my reading list and undo action of reading list items', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListClickToggle = await $(
      '[data-testing="toggle-reading-list"]'
    );
    await readingListClickToggle.click();
    let readingListitems = await $$('[data-testing="reading-book-list-item"]');
    const readingListitemsLength = readingListitems.length;
    const removeFromReadingListButton = await $(
      '[data-testing="remove-reading-list-button"]'
    );
    await removeFromReadingListButton.click();
    await (
      await browser.driver.findElement(
        by.tagName('.mat-simple-snackbar-action')
      )
    ).click();
    readingListitems = await $$('[data-testing="reading-book-list-item"]');
    expect(readingListitems.length).toEqual(readingListitemsLength);
    browser.sleep(2000);
    await removeFromReadingListButton.click();
    browser.sleep(1000);
  });
});
import { $, $$, browser, ExpectedConditions } from 'protractor';

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

  it('Then: should able to mark a book as read', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('Java');
    await form.submit();
    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);

    const searchItems = await $$('[data-testing="book-item"] button');
    searchItems[0].click();
    const readingListClickToAdd = await $(
      '[data-testing="toggle-reading-list"]'
    );
    await readingListClickToAdd.click();
    const finishReadingButton = await $(
      '[data-testing="mark-as-read"]'
    );
    await finishReadingButton.click();

    const finishText = await $('[data-testing="complete-reading"]');

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        finishText,
        'Completed On:'
      )
    );

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        finishText,
        'Finished'
      )
    );
    browser.sleep(200);
    await $('[data-testing="remove-book-from-readinglist"]').click();
  });
});
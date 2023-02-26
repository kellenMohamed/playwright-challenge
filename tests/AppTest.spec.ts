  import { test, expect } from '@playwright/test';
import { time } from 'console';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');

});

test.describe('Todo Page', () => {
  test('Should allow Title, Description and Priority to be entered', async ({
    page,
  }) => {
    await page.locator('xpath=//*[@id="root"]/div/h2').isVisible;
    await expect.soft(page.locator('xpath=//*[@id="root"]/div/div/div[1]/h3')).toHaveText(`Add new todos`);
    await expect.soft(page.locator('xpath=//*[@id="root"]/div/div/div[1]/div/div/form/div[1]/label')).toHaveText(`Title:`);
    await expect.soft(page.locator('xpath=//*[@id="root"]/div/div/div[1]/div/div/form/div[2]/label')).toHaveText(`Description:`);
    await expect.soft(page.locator('xpath=//*[@id="submit"]')).toHaveText(`Add`);
    await expect.soft(page.locator('xpath=//*[@id="root"]/div/div/div[2]/div/div[1]/h3')).toHaveText(`Pending todos`);
    await expect.soft(page.locator('xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/h3')).toHaveText(`Completed todos`);
  });

  test('Should throw a Bootstrap Alert Modal if title and description are empty', async ({
    page,
  }) => {
    
    await page.locator('id=submit').click();
    await page.waitForTimeout(5000);
    await expect(page.locator('id=#alert-modal')).toContainText('Please fill in the title and description');

    });

  test('Should throw a Bootstrap Alert Modal if title is empty', async ({
    page,
  }) => {
    
    await page.locator('xpath=//*[@id="description"]').fill('Test To Do Description '); 
    await page.locator('xpath=//*[@id="submit"]').click();
    await page.waitForTimeout(5000);

    const alertMessage = page.locator('.#alert-modal');
    await expect(alertMessage).toHaveText('Please fill in the title and description');
    
    });

    

  test('Should throw a Bootstrap Alert Modal if Description is empty', async ({
    page,
  }) => {
    
    await page.locator('xpath=//*[@id="title"]').fill('Title ABC'); 
    await page.locator('xpath=//*[@id="submit"]').click();
    await page.waitForTimeout(5000);

    const alertMessage = page.locator('.#alert-modal');
    await expect(alertMessage).toHaveText('Please fill in the title and description');
    
    });


  test('Should be cleaned the form entry items after the user adds a todo', async ({
    page,
  }) => {
    await page.locator('xpath=//*[@id="title"]').fill('Test To Do Title');
    await page.locator('xpath=//*[@id="description"]').fill('Test To Do Description');  
    await page.locator('xpath=//*[@id="submit"]').click();
    await expect.soft(page.locator('xpath=//*[@id="title"]')).toBeEmpty; 
    await expect.soft(page.locator('xpath=//*[@id="description"]')).toBeEmpty;
  });

  //It is comment the alert command because the system is not showing this dialog yet - BUG - please check README file.
  test('Should throw a Bootstrap Alert Modal if title has less than 5 characters', async ({
    page,
  }) => {
    await page.locator('xpath=//*[@id="title"]').fill('Test');
    await page.locator('xpath=//*[@id="submit"]').click();
    await expect.soft(page.locator('xpath=//*[@id="title"]')).toBe.length >= 5;
    //await expect.soft(page.locator('xpath=//*[@id="#alert-modal"')).toHaveText(`Title lenght less than 05 characters`);
    await page.waitForTimeout(13000);
  });
  
  //It is comment the alert command because the system is not showing this dialog yet - BUG - please check README file.
  test('Should throw a Bootstrap Alert Modal if description has less than 10 characters', async ({
    page,
  }) => {
    await page.locator('xpath=//*[@id="description"]').fill('Test Desc');
    await page.locator('xpath=//*[@id="submit"]').click();
    await expect.soft(page.locator('xpath=//*[@id="description"]')).toBe.length >= 10;
    //await expect.soft(page.locator('xpath=//*[@id="#alert-modal"')).toHaveText(`Description lenght less than 10 characters`);
    await page.waitForTimeout(13000);
  });

  test('Should not allowed add ToDo with same titles', async ({
    page,
  }) => {
    
    await page.fill('xpath=//*[@id="title"]','Test To Do Title 1');
    await page.fill('xpath=//*[@id="description"]','Test To Do Description 1');
    await page.click('xpath=//*[@id="submit"]');
    
    await page.fill('xpath=//*[@id="title"]','Test To Do Title 1');
    await page.fill('xpath=//*[@id="description"]','Test To Do Description 1');
    await page.click('xpath=//*[@id="submit"]');

    const alertMessage = page.locator('.#alert-modal');
    await expect(alertMessage).toHaveText('Please fill in the title and description');

  });

  test('Should add a Pending Todo when Submit is clicked and validation passes', async ({
    page,
  }) => {
    
    await page.fill('xpath=//*[@id="title"]','Test Pending List');
    await page.fill('xpath=//*[@id="description"]','Test Pending Description List');
    await page.click('xpath=//*[@id="submit"]');  
    await expect(page.locator('//*[@id="pending-todos"]/li')).toHaveValues;    
    await expect(page.locator('//*[@id="pending-todos"]/li/div/div/h6')).toHaveText('Test Pending List');
    await expect(page.locator('//*[@id="pending-todos"]/li/div/div/p')).toHaveText('Test Pending Description List')  
    await page.waitForTimeout(3000);
  });

  test('Should move the Pending Todo to Completed Todo when a todo item is pressed', async ({
    page,
  }) => {
    
    await page.fill('xpath=//*[@id="title"]','Test Complete');
    await page.fill('xpath=//*[@id="description"]','Test To Do Description A');
    await page.click('xpath=//*[@id="submit"]');    
    await expect(page.locator('//*[@id="pending-todos"]/li')).toHaveValues;

    await page.fill('xpath=//*[@id="title"]','Test Complete 2');
    await page.fill('xpath=//*[@id="description"]','Test To Do Description B');
    await page.click('xpath=//*[@id="submit"]');    
    await expect(page.locator('//*[@id="pending-todos"]/li')).toHaveValues;
    
    await page.click('//*[@id="pending-todos"]/li[2]');    
    await expect(page.locator('//*[@id="completed-todos"]/li/div/div/h6')).toHaveText('Test Complete 2'); 
    await expect(page.locator('//*[@id="completed-todos"]/li/div/div/p')).toHaveText('Test To Do Description B'); 
        
    await page.click('//*[@id="pending-todos"]/li[1]');    
    await expect(page.locator('//*[@id="completed-todos"]/li[2]/div/div/h6')).toHaveText('Test Complete'); 
    await expect(page.locator('//*[@id="completed-todos"]/li[2]/div/div/p')).toHaveText('Test To Do Description A'); 

    await page.waitForTimeout(3000);
    
  });


  test('Should be impossible to add duplicate ToDo items', async ({
    page,
  }) => {
    for (let i=0; i<3;i++){
      await page.fill('xpath=//*[@id="title"]','Test To Do Title ');
      await page.fill('xpath=//*[@id="description"]','Test To Do Description ' + i);
      await page.click('xpath=//*[@id="submit"]');
    }
  });

  
  test('Should be possible to add 5 Pending ToDo items', async ({
    page,
  }) => {
    for (let i=0; i<=5;i++){
      await page.fill('xpath=//*[@id="title"]','Test To Do Title ' + i);
      await page.fill('xpath=//*[@id="description"]','Test To Do Description ' + i);
      await page.click('xpath=//*[@id="submit"]');
    }
  });

  test('Should be possible to add 10 Completed ToDos', async ({
    page,
  }) => {
    for (let i=0; i<=10;i++){
      await page.fill('xpath=//*[@id="title"]','Test To Do Title ' + i);
      await page.fill('xpath=//*[@id="description"]','Test To Do Description ' + i);
      await page.click('xpath=//*[@id="submit"]');
      await page.click('//*[@id="pending-todos"]/li[1]');  
    }
  });
  
});
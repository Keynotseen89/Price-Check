import {test, expect, type Page} from '@playwright/test';
import { sendEmailToMobile } from '../functions/sendEmail';
import { asyncWriteFile } from '../functions/writeFile';
import { StoreName } from '../string/storename';
import { StoreURL } from '../used-urls/store_urls';
import { ChromeConfig } from '../string/browser-config';
import { discountPrice } from '../functions/discount-function';
import { fillInEmailMessage } from '../functions/emailMessage'
const { chromium } = require('playwright');

const orginalPrice = 199.99
let itemFivePercentDiscount = discountPrice(orginalPrice, 5)
let itemTenPercentDiscount = discountPrice(orginalPrice, 10)
let itemFifteenPercentDiscount = discountPrice(orginalPrice, 15)

let dateTime = new Date().toString()
dateTime = dateTime.substring(0, dateTime.lastIndexOf('GMT-0800'))

let deviceName = 'Epson EcoTank ET-2803 Inkjet Printer'

test.describe('Epson EcoTank Printer',() => {


    let emailTextToSend: String = ``

    test.beforeAll(async ({}) => {
        emailTextToSend = ''
    })

    test(`Get price of ${deviceName} in ${StoreName.TargetStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.googleReferers }); 
        const epsonTargetPage = await context.newPage();
        await epsonTargetPage.goto(StoreURL.TargetEpsonEcoTank);
        await epsonTargetPage.waitForLoadState('load', {setTimeout: 100000});
        
        const epsonName = await epsonTargetPage.locator('h1[id="pdp-product-title-id"]').first().innerText();
        const epsonPrice = await epsonTargetPage.locator('[id=above-the-fold-information]').first().locator('[data-test=product-price]').first().innerText()


        let itemCurrentPrice = epsonPrice.toString().replace('$','').replace(',','');
        
        if( itemCurrentPrice <= itemFivePercentDiscount || itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemFifteenPercentDiscount)
        {
            let emailTextMessage = await fillInEmailMessage(StoreName.TargetStore, itemCurrentPrice.toString().trim(), StoreURL.TargetEpsonEcoTank)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }

        await asyncWriteFile('../records-file/epson-printer-item.txt', '\n' + epsonName.toString().trim() + ', ' + StoreName.TargetStore + ', ' + epsonPrice.replace(',','').trim() + ', ' + dateTime )
        
        await browser.close();  
    })

    test(`Get price of ${deviceName} in ${StoreName.WalmartStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.googleReferers }); 
        const epsonWalmartPage = await context.newPage();
        await epsonWalmartPage.goto(StoreURL.WalmartEpsonEcoTank);
        await epsonWalmartPage.waitForLoadState('load', {setTimeout: 100000});
        
        const epsonName = await epsonWalmartPage.locator('[id=main-title]').first().innerText();
        const epsonPrice = await epsonWalmartPage.locator('[data-testid=price-wrap]').first().locator('[itemprop=price]').first().innerText()

        let itemCurrentPrice = epsonPrice.toString().replace('$','').replace(',','');
           
        if( itemCurrentPrice <= itemFivePercentDiscount || itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemFifteenPercentDiscount)
        {
            let emailTextMessage = await fillInEmailMessage(StoreName.WalmartStore, itemCurrentPrice.toString().trim(), StoreURL.WalmartEpsonEcoTank)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }
        
        await asyncWriteFile('../records-file/epson-printer-item.txt', '\n' + epsonName.trim() + ''  + ', ' + StoreName.WalmartStore + ', ' + epsonPrice.replace(',','').trim() + ', ' + dateTime )
        
        await browser.close();  
    })

    test(`Get price of ${deviceName} in ${StoreName.BestBuyStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.googleReferers }); 
        const epsonBestBuyPage = await context.newPage();
        await epsonBestBuyPage.goto(StoreURL.BestBuyEpsonEcoTank);
        await epsonBestBuyPage.waitForLoadState('load', {setTimeout: 100000});
        
        const epsonName = await epsonBestBuyPage.locator("div[id^=shop-product-title] div[class=sku-title]").first().innerText();
        const epsonPrice = await epsonBestBuyPage.locator("[data-testid^=customer-price]").first().locator("span[aria-hidden]").innerText()


        let itemCurrentPrice = epsonPrice.toString().replace('$','').replace(',','');
        
        if( itemCurrentPrice <= itemFivePercentDiscount || itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemFifteenPercentDiscount)
        {
            let emailTextMessage = await fillInEmailMessage(StoreName.BestBuyStore, itemCurrentPrice.toString().trim(), StoreURL.BestBuyEpsonEcoTank)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }

        await asyncWriteFile('../records-file/epson-printer-item.txt', '\n' + epsonName.toString().trim() + ', ' + StoreName.BestBuyStore + ', ' + epsonPrice.replace(',','').trim() + ', ' + dateTime )
        
        await browser.close();  
    })

    test.afterAll(async ({}) => {
        console.log("DEBUGGING MESSAGE BEFORE SENDING SEEE ME \n"+ emailTextToSend)

        if(emailTextToSend != ``){
            await sendEmailToMobile(emailTextToSend)
        }
        emailTextToSend = ``
    })
})
import {test, expect, type Page} from '@playwright/test';
import { sendEmailToMobile } from '../functions/sendEmail';
import { asyncWriteFile } from '../functions/writeFile';
import { StoreName } from '../string/storename';
import { StoreURL } from '../used-urls/store_urls';
import { fillInEmailMessage } from '../functions/emailMessage'
import { ChromeConfig } from '../string/browser-config';
import { discountPrice} from '../functions/discount-function'
const { chromium } = require('playwright');

const orginalPrice = 699.99
let itemTenPercentDiscount = discountPrice(orginalPrice, 5)
let itemTwentyPercentDiscount = discountPrice(orginalPrice, 10)
let itemThirtyPercentDiscount = discountPrice(orginalPrice, 15)

let dateTime = new Date().toString()
dateTime = dateTime.substring(0, dateTime.lastIndexOf('GMT-0800'))

let deviceName = 'Netgear Nighthawk M6 5G'

test.describe('Netgear Nighthawk M6 5G',() => {


    let emailTextToSend: String = ``

    test.beforeAll(async ({}) => {
        emailTextToSend = ''
    })

    test(`Get price of ${deviceName} in ${StoreName.BestBuyStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.bestbuyReferers }); 
        const netgearPage = await context.newPage();
        await netgearPage.goto(StoreURL.BestBuyNetgear);
        await netgearPage.waitForLoadState('load', {setTimeout: 100000});
        
        const netgearName = await netgearPage.locator("div[id^=shop-product-title] div[class=sku-title]").first().innerText();
        const netgearPrice = await netgearPage.locator("[data-testid^=customer-price]").first().locator("span[aria-hidden]").innerText()


        let itemCurrentPrice = netgearPrice.toString().replace('$','').replace(',','');
        
        if( itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemTwentyPercentDiscount || itemCurrentPrice <= itemThirtyPercentDiscount)
        {
            let emailTextMessage = await fillInEmailMessage(StoreName.BestBuyStore, itemCurrentPrice.toString().trim(), StoreURL.BestBuyNetgear)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }

        await asyncWriteFile('../records-file/netgear-item.txt', '\n' + netgearName.toString().trim() + ', ' + StoreName.BestBuyStore + ', ' + netgearPrice.replace(',','').trim() + ', ' + dateTime )
        
        await browser.close();  
    })

    test(`Get price of ${deviceName} in ${StoreName.AmazonStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.chromeUserAgent }); 
        const netgearAmazonPage = await context.newPage();
        await netgearAmazonPage.goto(StoreURL.AmazonNetgear);
        await netgearAmazonPage.waitForLoadState('load', {setTimeout: 100000});
        
        const netgearName = await netgearAmazonPage.locator("span[id=productTitle]").innerText();
        const netgearPrice = await netgearAmazonPage.locator("div[id=apex_offerDisplay_desktop] span[class=a-offscreen]").first().innerText()

        let itemCurrentPrice = netgearPrice.toString().replace('$','').replace(',','');
           
        if( itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemTwentyPercentDiscount || itemCurrentPrice <= itemThirtyPercentDiscount)
        {
            let emailTextMessage = await fillInEmailMessage(StoreName.AmazonStore, itemCurrentPrice.toString().trim(), StoreURL.AmazonNetgear)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }
        
        await asyncWriteFile('../records-file/netgear-item.txt', '\n' + netgearName.substring(0, netgearName.lastIndexOf('Router,'))  + ', ' + StoreName.AmazonStore + ', ' + netgearPrice.replace(',','').trim() + ', ' + dateTime )
        
        await browser.close();  
    })

    test(`Get price of ${deviceName} in ${StoreName.NetgearStore}`, async ({}) => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ userAgent: ChromeConfig.chromeUserAgent, Referer: ChromeConfig.googleReferers }); 
        const netgearWebPage = await context.newPage();
        await netgearWebPage.goto(StoreURL.NetgearWebpage);
        await netgearWebPage.waitForLoadState('load', {setTimeout: 100000});
        
        const netgearName = await netgearWebPage.locator("div[id=overview] div.title-block h1.h3").first().innerText()
        const netgearPrice = await netgearWebPage.locator("div[id=price-value-div] p.new-price").first().innerText()


        let itemCurrentPrice = netgearPrice.toString().replace('$','').replace(',','');

        
        console.log("THIS ONE HERE -> : " + netgearName.toString().substring(0, netgearName.lastIndexOf('Router,')).trim())
        console.log("THIS PRICE -> " + itemCurrentPrice )
        
        if( itemCurrentPrice <= itemTenPercentDiscount || itemCurrentPrice <= itemTwentyPercentDiscount || itemCurrentPrice <= itemThirtyPercentDiscount)
        {
            console.log(itemCurrentPrice)
            console.log(itemTenPercentDiscount)
            console.log(itemTwentyPercentDiscount)
            console.log(itemThirtyPercentDiscount)
            let emailTextMessage = await fillInEmailMessage(StoreName.NetgearStore, itemCurrentPrice.toString().trim(), StoreURL.NetgearWebpage)
            emailTextToSend = emailTextToSend.concat(emailTextMessage.toString())
        }

        await asyncWriteFile('../records-file/netgear-item.txt', '\n' + netgearName.substring(0, netgearName.lastIndexOf('Router,')).trim()  + ', ' + StoreName.NetgearStore + ', ' + netgearPrice.replace(',','').trim() + ', ' + dateTime )
        
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
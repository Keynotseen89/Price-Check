export async function fillInEmailMessage(storeName: String, itemPrice: String, urlLink: String): Promise<string>{
    let emailMessage = `STORE NAME: ${storeName}\n` + `PRICE: ${itemPrice}\n` + `WEBSITE: ${urlLink}\n\n\n`
    return emailMessage
}
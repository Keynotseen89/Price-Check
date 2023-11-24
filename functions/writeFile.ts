import { promises as fsPromises } from 'fs';
import { join } from 'path';

export async function asyncWriteFile(filename: string, data: any){
    try{
        await fsPromises.appendFile(join(__dirname, filename), data, {
            flag: 'a',
        });

        const contents = await fsPromises.readFile(
            join(__dirname, filename),
            'utf-8',
        );
        
        //console.log(contents)
        return contents
    } catch (err) {
        console.log(err);
        return 'Something went wrong';
    }
}
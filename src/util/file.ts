import * as Fs from 'fs';
import * as Path from 'path';

export function getTextFile(path: string) {
    let file = Fs.readFileSync(path);
    return file.toString();
}

export function saveTextFile(path: string, contents: string) {
    Fs.writeFileSync(path, contents);
}

// 주의
// 일단은 만들어뒀는데, 오버헤드가 크므로, 디렉토리를 확장할 시 getDirectory() function을 이용하는 것이 좋을 것 같음.
// 사용할 것이라면 Background에서 돌아가게 하는 것이 좋음
export function getTraversalResult(path: string) {
    let root = path;
    let stack = Fs.readdirSync(root).map((p) => {
        return Path.join(root, p);
    });
    let ret = new Array();
    while (true) {
        let pop = stack.pop();
        if (!pop) 
            break;
        let file_info = Fs.statSync(pop);
        if (!file_info.isDirectory()) {
            ret.push(pop);
            continue;
        }
        let subdir = Fs.readdirSync(pop)
        for (let i = 0; i < subdir.length; i++) {
            stack.push(Path.join(pop, subdir[i]));
        }
        ret.push(pop);
    }
    return ret;
}

export function isDirectory(path: string) {
    return Fs.statSync(path).isDirectory();
}

export function getDirectory(directory: string) {
    // file name -> absolute path mapping
    let dir = Fs.readdirSync(directory).map((p) => {
        return Path.join(directory, p);
    });
    return dir;
}
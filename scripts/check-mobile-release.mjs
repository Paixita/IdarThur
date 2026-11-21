import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const release=JSON.parse(await readFile('mobile/channel.json','utf8'));
if(release.ready){
 const file='public/downloads/idarthur-'+release.versionName+'.apk';
 const bytes=await readFile(file);
 if(bytes.length!==release.sizeBytes||createHash('sha256').update(bytes).digest('hex')!==release.sha256)throw new Error('El APK publicado no coincide con la versión y su firma de integridad.');
 console.log('Android release verified:',release.versionName,bytes.length,'bytes.');
}

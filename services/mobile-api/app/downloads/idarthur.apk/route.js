import release from '@/mobile/channel.json';
export async function GET(request){
 if(!release.ready)return Response.json({error:'Descarga no disponible.'},{status:503});
 return Response.redirect(new URL('/downloads/idarthur-'+release.versionName+'.apk',request.url),307);
}

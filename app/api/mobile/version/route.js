import channel from '@/mobile/channel.json';
export async function GET(){return Response.json(channel,{headers:{'Cache-Control':'no-store'}});}

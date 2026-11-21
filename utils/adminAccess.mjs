import {timingSafeEqual} from 'node:crypto';
export function adminAuthorized(request){
 const expected=process.env.IDARTHUR_ADMIN_TOKEN;
 const supplied=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!expected||!supplied)return false;
 const a=Buffer.from(expected),b=Buffer.from(supplied);
 return a.length===b.length&&timingSafeEqual(a,b);
}

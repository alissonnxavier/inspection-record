'use server'

import { cookies } from 'next/headers';
import { decode, getToken } from 'next-auth/jwt';


const cookiesStore = cookies();

export const setCookie = () => {
    cookiesStore.set("jwt", '');
}

export const getCookie = async () => {
    const token = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..G6i4QXo-_aB8fgih.O4TrfONBOvSuMLREjjSv-zDcrL6Q3sFSTvCynzTT-P4e_Tf6gN0xcvrtCZtYOC3QDz-DnA0we56_vVd7Dn5Jf9F-GBE5mfd-3iH16OHai1HR6Lt1La532B7-4F9tDXkVUd_Fx5HDvtop7kXMbubRQqbw9e99PH7SHBXWdnTIOKqpvEAffWb5h9BqA8kaSbDEtvAngNdZzI-b4eWhkg_9YMC-iqdoTg.3IZAPQnTznUVIRPudhiiUQ'
    const cookie = await cookiesStore.get('next-auth.session-token');
}



//eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..E6zEZLgWEUqfD61G.B3Zq91bdogmqxspuDkXXdHXYdXbDQrRjfK8i01NRk3Fpa1mi_k4TlQpqEqyvNF-Fucgwp6hmwazEeKeaA9blpv8LfpI5LgxJPgUmrfxCgxSzZSGm6J_CYKEr39YyhSsf8nm_IdW1beA7Sd3Y_nLgEFGFou915CUkatkuSEJ4kIgZY8KLVfMv6DjHuCnpIIOJPDhuUC6UVuMp2A1XhhUWP2AEEbQ4Yg.NPEX0WtRiSvS4LadhCttrQ

//next-auth.session-token
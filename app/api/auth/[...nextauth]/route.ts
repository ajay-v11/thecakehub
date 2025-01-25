import NextAuth from 'next-auth';
import {options} from './options';

const handler = NextAuth(options);
console.log('jpsodjiaf');

export {handler as GET, handler as POST};

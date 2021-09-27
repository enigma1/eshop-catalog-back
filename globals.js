import fetch from 'node-fetch';
import fastify from 'fastify';
import {envConfig} from '^/config';

!globalThis.fetch && (globalThis.fetch = fetch);

if(!globalThis.server) {
  const {ssl} = envConfig;
  globalThis.server = fastify({https: ssl});
}

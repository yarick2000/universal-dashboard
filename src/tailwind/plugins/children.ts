import plugin from 'tailwindcss/plugin';

const childrenPlugin = plugin((api) => {
  api.matchVariant('ic', (value) => `& ${value}`);
  api.matchVariant('dc', (value) => `&>${value}`);
  api.matchVariant('ice', (value) => `& [data-element-${value}]`);
  api.matchVariant('dce', (value) => `&>[data-element-${value}]`);
});

export default childrenPlugin;
